#!/bin/bash
BASE="http://localhost:3000"

echo "=== Test 1: Patient JSON ==="
curl -s -X POST "$BASE/auth/signup/patient" \
  -H "Content-Type: application/json" \
  -d '{"fullName":"Test JSON","email":"tjson@test.com","phoneNumber":"+201111111117","gender":"Male","password":"password123"}' | grep -o '"success":true'

echo "=== Test 2: Patient Form-Data ==="
curl -s -X POST "$BASE/auth/signup/patient" \
  -F "fullName=Test Form" \
  -F "email=tform@test.com" \
  -F "phoneNumber=+201111111118" \
  -F "gender=Male" \
  -F "password=password123" | grep -o '"success":true'

echo "=== Test 3: Patient with File ==="
curl -s -X POST "$BASE/auth/signup/patient" \
  -F "fullName=Test File" \
  -F "email=tfile@test.com" \
  -F "phoneNumber=+201111111119" \
  -F "gender=Male" \
  -F "password=password123" \
  -F "personalPhoto=@/home/khaled/Downloads/cat-sound.png" | grep -o '"success":true'

echo "=== Test 4: Login JSON ==="
curl -s -X POST "$BASE/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"tjson@test.com","password":"password123"}' | grep -o '"success":true'

echo "=== Test 5: Login Form ==="
curl -s -X POST "$BASE/auth/login" \
  -F "email=tform@test.com" \
  -F "password=password123" | grep -o '"success":true'

echo "=== All tests complete ==="
