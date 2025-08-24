#!/usr/bin/env python3
"""
Simple test script to verify backend deployment works
"""
import requests
import json

def test_backend():
    backend_url = "https://linkr-no0wbvuzc-writetosagniks-projects.vercel.app"
    
    # Test 1: Check if backend is alive
    try:
        response = requests.get(f"{backend_url}/")
        print(f"Backend status: {response.status_code}")
        if response.status_code == 200:
            print(f"Response: {response.json()}")
    except Exception as e:
        print(f"Backend test failed: {e}")
    
    # Test 2: Try QR generation
    try:
        data = {
            "url": "https://example.com",
            "foreground_color": "#000000",
            "background_color": "#ffffff",
            "format": "png"
        }
        response = requests.post(f"{backend_url}/generate-qr", json=data)
        print(f"QR generation status: {response.status_code}")
        if response.status_code == 200:
            print("QR generation successful!")
        else:
            print(f"QR generation failed: {response.text}")
    except Exception as e:
        print(f"QR generation test failed: {e}")

if __name__ == "__main__":
    test_backend()
