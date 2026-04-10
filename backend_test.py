import requests
import sys
import json
from datetime import datetime

class GuitarPickupAPITester:
    def __init__(self, base_url="https://sync-playhead-five.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.tests_run = 0
        self.tests_passed = 0
        self.created_track_ids = []

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.api_url}/{endpoint}" if endpoint else self.api_url
        if headers is None:
            headers = {'Content-Type': 'application/json'}

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=10)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=headers, timeout=10)
            elif method == 'DELETE':
                response = requests.delete(url, headers=headers, timeout=10)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    if method == 'POST' and 'id' in response_data:
                        self.created_track_ids.append(response_data['id'])
                    return True, response_data
                except:
                    return True, {}
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                try:
                    error_data = response.json()
                    print(f"   Error: {error_data}")
                except:
                    print(f"   Response: {response.text}")
                return False, {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            return False, {}

    def test_api_root(self):
        """Test API root endpoint"""
        return self.run_test("API Root", "GET", "", 200)

    def test_get_tracks_empty(self):
        """Test getting tracks when database might be empty"""
        success, response = self.run_test("Get Tracks (Initial)", "GET", "tracks", 200)
        if success:
            print(f"   Found {len(response)} existing tracks")
        return success

    def test_create_track(self, track_data):
        """Test creating a new track"""
        success, response = self.run_test(
            f"Create Track: {track_data['title']}", 
            "POST", 
            "tracks", 
            200,  # Based on the server.py, it should return 200, not 201
            data=track_data
        )
        return success, response

    def test_get_tracks_with_data(self):
        """Test getting tracks after creating some"""
        success, response = self.run_test("Get Tracks (With Data)", "GET", "tracks", 200)
        if success:
            print(f"   Retrieved {len(response)} tracks")
            for track in response:
                required_fields = ['id', 'title', 'description', 'audioUrl', 'imageUrl', 'createdAt']
                missing_fields = [field for field in required_fields if field not in track]
                if missing_fields:
                    print(f"   ⚠️  Track {track.get('id', 'unknown')} missing fields: {missing_fields}")
                else:
                    print(f"   ✅ Track '{track['title']}' has all required fields")
        return success, response if success else []

    def test_update_track(self, track_id, update_data):
        """Test updating an existing track"""
        return self.run_test(
            f"Update Track: {track_id}", 
            "PUT", 
            f"tracks/{track_id}", 
            200, 
            data=update_data
        )

    def test_delete_track(self, track_id):
        """Test deleting a track"""
        return self.run_test(
            f"Delete Track: {track_id}", 
            "DELETE", 
            f"tracks/{track_id}", 
            200
        )

    def test_get_nonexistent_track(self):
        """Test getting a track that doesn't exist"""
        fake_id = "nonexistent-track-id"
        return self.run_test(
            "Get Nonexistent Track", 
            "GET", 
            f"tracks/{fake_id}", 
            404
        )

    def test_update_nonexistent_track(self):
        """Test updating a track that doesn't exist"""
        fake_id = "nonexistent-track-id"
        update_data = {"title": "Updated Title"}
        return self.run_test(
            "Update Nonexistent Track", 
            "PUT", 
            f"tracks/{fake_id}", 
            404, 
            data=update_data
        )

    def test_delete_nonexistent_track(self):
        """Test deleting a track that doesn't exist"""
        fake_id = "nonexistent-track-id"
        return self.run_test(
            "Delete Nonexistent Track", 
            "DELETE", 
            f"tracks/{fake_id}", 
            404
        )

    def cleanup_created_tracks(self):
        """Clean up tracks created during testing"""
        print(f"\n🧹 Cleaning up {len(self.created_track_ids)} created tracks...")
        for track_id in self.created_track_ids:
            try:
                response = requests.delete(f"{self.api_url}/tracks/{track_id}", timeout=10)
                if response.status_code == 200:
                    print(f"   ✅ Deleted track {track_id}")
                else:
                    print(f"   ⚠️  Failed to delete track {track_id}")
            except Exception as e:
                print(f"   ❌ Error deleting track {track_id}: {e}")

def main():
    print("🎸 Guitar Pickup Comparison API Testing")
    print("=" * 50)
    
    tester = GuitarPickupAPITester()
    
    # Test sample track data
    sample_tracks = [
        {
            "title": "Humbucker Bridge Test",
            "description": "Gibson 498T - Warm tone with clarity",
            "audioUrl": "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
            "imageUrl": "https://images.unsplash.com/photo-1708164592948-bc5cc7f74d49?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2ODh8MHwxfHNlYXJjaHw0fHxlbGVjdHJpYyUyMGd1aXRhciUyMGh1bWJ1Y2tlciUyMHBpY2t1cHxlbnwwfHx8fDE3NzU4Mjc0NzR8MA&ixlib=rb-4.1.0&q=85"
        },
        {
            "title": "Single Coil Neck Test",
            "description": "Fender Texas Special - Bright and articulate",
            "audioUrl": "https://www.soundjay.com/misc/sounds/bell-ringing-04.wav",
            "imageUrl": "https://images.unsplash.com/photo-1708164592913-f8a7a32d2c50?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2ODh8MHwxfHNlYXJjaHwyfHxlbGVjdHJpYyUyMGd1aXRhciUyMGh1bWJ1Y2tlciUyMHBpY2t1cHxlbnwwfHx8fDE3NzU4Mjc0NzR8MA&ixlib=rb-4.1.0&q=85"
        }
    ]

    try:
        # Test API root
        tester.test_api_root()
        
        # Test getting tracks initially
        tester.test_get_tracks_empty()
        
        # Test creating tracks
        created_tracks = []
        for track_data in sample_tracks:
            success, response = tester.test_create_track(track_data)
            if success:
                created_tracks.append(response)
        
        # Test getting tracks with data
        success, tracks = tester.test_get_tracks_with_data()
        
        # Test updating a track if we have one
        if created_tracks:
            track_to_update = created_tracks[0]
            update_data = {
                "title": "Updated Humbucker Test",
                "description": "Updated description for testing"
            }
            tester.test_update_track(track_to_update['id'], update_data)
        
        # Test error cases
        tester.test_get_nonexistent_track()
        tester.test_update_nonexistent_track()
        tester.test_delete_nonexistent_track()
        
        # Test deleting a track if we have one
        if len(created_tracks) > 1:
            tester.test_delete_track(created_tracks[1]['id'])
            # Remove from cleanup list since we already deleted it
            if created_tracks[1]['id'] in tester.created_track_ids:
                tester.created_track_ids.remove(created_tracks[1]['id'])

    except Exception as e:
        print(f"\n❌ Unexpected error during testing: {e}")
    
    finally:
        # Clean up remaining tracks
        tester.cleanup_created_tracks()
    
    # Print results
    print(f"\n📊 Test Results")
    print("=" * 30)
    print(f"Tests run: {tester.tests_run}")
    print(f"Tests passed: {tester.tests_passed}")
    print(f"Success rate: {(tester.tests_passed/tester.tests_run*100):.1f}%")
    
    if tester.tests_passed == tester.tests_run:
        print("🎉 All tests passed!")
        return 0
    else:
        print("⚠️  Some tests failed")
        return 1

if __name__ == "__main__":
    sys.exit(main())