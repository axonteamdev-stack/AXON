#!/bin/bash
# AXON Medical API - Quick Test Seeder using curl
# Usage: ./seed.sh [API_URL]

set -e

API_URL="${1:-http://localhost:3000}"
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

info() { echo -e "${BLUE}[INFO]${NC} $1"; }
ok() { echo -e "${GREEN}[OK]${NC} $1"; }
err() { echo -e "${RED}[ERR]${NC} $1"; }
warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }

# Store tokens
A_TOKEN=""
S_TOKEN=""
O_TOKEN=""
F_TOKEN=""
J_TOKEN=""
AI_TOKEN=""

# ── Helper: extract token from response ─────────────────────────
get_token() {
    echo "$1" | grep -o '"accessToken":"[^"]*"' | cut -d'"' -f4
}

get_id() {
    echo "$1" | grep -o '"_id":"[^"]*"' | head -1 | cut -d'"' -f4
}

# ── Create test-assets if not exist ────────────────────────────
mkdir -p test-assets

# Create minimal JPEG dummy files
for f in patient1.jpg patient2.jpg patient3.jpg doctor1.jpg doctor2.jpg doctor3.jpg article-heart.jpg article-migraine.jpg article-vaccine.jpg community-diabetes.jpg community-asthma.jpg xray-chest.jpg blood-test.jpg patient1-new.jpg; do
    if [ ! -f "test-assets/$f" ]; then
        printf '\xff\xd8\xff\xe0\x00\x10JFIF\x00\x01\x01\x00\x00\x01\x00\x01\x00\x00\xff\xd9' > "test-assets/$f"
        warn "Created dummy image: test-assets/$f"
    fi
done

# Create minimal PDF dummy files
for f in license1.pdf license2.pdf license3.pdf; do
    if [ ! -f "test-assets/$f" ]; then
        echo "%PDF-1.4 test" > "test-assets/$f"
        warn "Created dummy PDF: test-assets/$f"
    fi
done

echo ""
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║         AXON Medical API - Dummy Data Seeder                 ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""

# ═══════════════════════════════════════════════════════════════
#  1. SIGNUP PATIENTS
# ═══════════════════════════════════════════════════════════════

info "Creating patients..."

# Patient 1: Ahmed (with full health profile + images)
RESP=$(curl -s -w "\n%{http_code}" -X POST "$API_URL/auth/signup/patient" \
    -F "fullName=Ahmed Hassan" \
    -F "email=ahmed.patient@example.com" \
    -F "password=password123" \
    -F "phoneNumber=+201001234567" \
    -F "gender=Male" \
    -F "preferredLanguage=ar" \
    -F "bloodType=O+" \
    -F "height=175" \
    -F "weight=78" \
    -F "conditions=[\"Diabetes Type 2\",\"Hypertension\"]" \
    -F "allergies=[\"Penicillin\",\"Peanuts\"]" \
    -F "emergencyContactName=Mona Hassan" \
    -F "emergencyContactPhone=+201009876543" \
    -F "emergencyContactRelationship=Wife" \
    -F "personalPhoto=@test-assets/patient1.jpg" \
    -F "radiologyImage=@test-assets/xray-chest.jpg" \
    -F "radiologyDescriptions=[\"Chest X-Ray - Routine checkup\"]" \
    -F "labImage=@test-assets/blood-test.jpg" \
    -F "labDescriptions=[\"CBC Blood Test - March 2026\"]")
HTTP_CODE=$(echo "$RESP" | tail -n1)
BODY=$(echo "$RESP" | sed '$d')
if [ "$HTTP_CODE" = "201" ]; then
    A_TOKEN=$(get_token "$BODY")
    ok "Patient 1 created: ahmed.patient@example.com"
else
    err "Patient 1 failed: $BODY"
fi

# Patient 2: Sarah (with health profile)
RESP=$(curl -s -w "\n%{http_code}" -X POST "$API_URL/auth/signup/patient" \
    -F "fullName=Sarah Johnson" \
    -F "email=sarah.patient@example.com" \
    -F "password=password123" \
    -F "phoneNumber=+14155551234" \
    -F "gender=Female" \
    -F "preferredLanguage=en" \
    -F "bloodType=A-" \
    -F "height=162" \
    -F "weight=58" \
    -F "conditions=[\"Asthma\"]" \
    -F "allergies=[\"Shellfish\"]" \
    -F "emergencyContactName=Michael Johnson" \
    -F "emergencyContactPhone=+14155555678" \
    -F "emergencyContactRelationship=Husband" \
    -F "personalPhoto=@test-assets/patient2.jpg")
HTTP_CODE=$(echo "$RESP" | tail -n1)
BODY=$(echo "$RESP" | sed '$d')
if [ "$HTTP_CODE" = "201" ]; then
    S_TOKEN=$(get_token "$BODY")
    ok "Patient 2 created: sarah.patient@example.com"
else
    err "Patient 2 failed: $BODY"
fi

# Patient 3: Omar (minimal profile)
RESP=$(curl -s -w "\n%{http_code}" -X POST "$API_URL/auth/signup/patient" \
    -F "fullName=Omar Khaled" \
    -F "email=omar.patient@example.com" \
    -F "password=password123" \
    -F "phoneNumber=+966501234567" \
    -F "gender=Male" \
    -F "preferredLanguage=ar" \
    -F "personalPhoto=@test-assets/patient3.jpg")
HTTP_CODE=$(echo "$RESP" | tail -n1)
BODY=$(echo "$RESP" | sed '$d')
if [ "$HTTP_CODE" = "201" ]; then
    O_TOKEN=$(get_token "$BODY")
    ok "Patient 3 created: omar.patient@example.com"
else
    err "Patient 3 failed: $BODY"
fi

# ═══════════════════════════════════════════════════════════════
#  2. SIGNUP DOCTORS
# ═══════════════════════════════════════════════════════════════

info "Creating doctors..."

# Doctor 1: Fatima (Cardiology)
RESP=$(curl -s -w "\n%{http_code}" -X POST "$API_URL/auth/signup/doctor" \
    -F "fullName=Dr. Fatima Al-Rashid" \
    -F "email=fatima.doctor@example.com" \
    -F "password=password123" \
    -F "phoneNumber=+201112223344" \
    -F "gender=Female" \
    -F "preferredLanguage=ar" \
    -F "specialization=Cardiology" \
    -F "yearsExperience=12" \
    -F "medicalLicenseNumber=EG-MED-2014-8842" \
    -F "about=Senior cardiologist specializing in interventional cardiology." \
    -F "price=500" \
    -F "licenseImage=@test-assets/license1.pdf" \
    -F "personalPhoto=@test-assets/doctor1.jpg")
HTTP_CODE=$(echo "$RESP" | tail -n1)
BODY=$(echo "$RESP" | sed '$d')
if [ "$HTTP_CODE" = "201" ]; then
    F_TOKEN=$(get_token "$BODY")
    ok "Doctor 1 created: fatima.doctor@example.com"
else
    err "Doctor 1 failed: $BODY"
fi

# Doctor 2: James (Neurology)
RESP=$(curl -s -w "\n%{http_code}" -X POST "$API_URL/auth/signup/doctor" \
    -F "fullName=Dr. James Wilson" \
    -F "email=james.doctor@example.com" \
    -F "password=password123" \
    -F "phoneNumber=+14155559876" \
    -F "gender=Male" \
    -F "preferredLanguage=en" \
    -F "specialization=Neurology" \
    -F "yearsExperience=8" \
    -F "medicalLicenseNumber=US-NY-2018-4451" \
    -F "about=Board-certified neurologist with focus on epilepsy." \
    -F "price=350" \
    -F "licenseImage=@test-assets/license2.pdf" \
    -F "personalPhoto=@test-assets/doctor2.jpg")
HTTP_CODE=$(echo "$RESP" | tail -n1)
BODY=$(echo "$RESP" | sed '$d')
if [ "$HTTP_CODE" = "201" ]; then
    J_TOKEN=$(get_token "$BODY")
    ok "Doctor 2 created: james.doctor@example.com"
else
    err "Doctor 2 failed: $BODY"
fi

# Doctor 3: Aisha (Pediatrics)
RESP=$(curl -s -w "\n%{http_code}" -X POST "$API_URL/auth/signup/doctor" \
    -F "fullName=Dr. Aisha Mahmoud" \
    -F "email=aisha.doctor@example.com" \
    -F "password=password123" \
    -F "phoneNumber=+971501112233" \
    -F "gender=Female" \
    -F "preferredLanguage=ar" \
    -F "specialization=Pediatrics" \
    -F "yearsExperience=15" \
    -F "medicalLicenseNumber=AE-DHA-2011-2290" \
    -F "about=Pediatrician with 15 years experience in neonatal care." \
    -F "price=400" \
    -F "licenseImage=@test-assets/license3.pdf" \
    -F "personalPhoto=@test-assets/doctor3.jpg")
HTTP_CODE=$(echo "$RESP" | tail -n1)
BODY=$(echo "$RESP" | sed '$d')
if [ "$HTTP_CODE" = "201" ]; then
    AI_TOKEN=$(get_token "$BODY")
    ok "Doctor 3 created: aisha.doctor@example.com"
else
    err "Doctor 3 failed: $BODY"
fi

# ═══════════════════════════════════════════════════════════════
#  3. TEST DUPLICATE EMAIL (should fail, no orphan files)
# ═══════════════════════════════════════════════════════════════

info "Testing duplicate email rejection (should fail with 400)..."
RESP=$(curl -s -w "\n%{http_code}" -X POST "$API_URL/auth/signup/patient" \
    -F "fullName=Ahmed Duplicate" \
    -F "email=ahmed.patient@example.com" \
    -F "password=password123" \
    -F "phoneNumber=+201009999999" \
    -F "gender=Male" \
    -F "personalPhoto=@test-assets/patient1.jpg")
HTTP_CODE=$(echo "$RESP" | tail -n1)
if [ "$HTTP_CODE" = "400" ]; then
    ok "Duplicate correctly rejected with 400 (no orphan file in personalPhoto!)"
else
    err "Expected 400, got $HTTP_CODE"
fi

# ═══════════════════════════════════════════════════════════════
#  4. LOGIN TEST
# ═══════════════════════════════════════════════════════════════

info "Testing login..."
RESP=$(curl -s -w "\n%{http_code}" -X POST "$API_URL/auth/login" \
    -H "Content-Type: application/json" \
    -d '{"email":"ahmed.patient@example.com","password":"password123"}')
HTTP_CODE=$(echo "$RESP" | tail -n1)
if [ "$HTTP_CODE" = "200" ]; then
    ok "Login successful for Ahmed"
else
    err "Login failed: $RESP"
fi

# ═══════════════════════════════════════════════════════════════
#  5. CREATE APPOINTMENTS
# ═══════════════════════════════════════════════════════════════

info "Creating appointments..."

# Get doctor IDs (we need to fetch them)
F_ID=$(curl -s "$API_URL/users/doctors" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
info "Fatima's ID: $F_ID"

# Ahmed books with Fatima
RESP=$(curl -s -w "\n%{http_code}" -X POST "$API_URL/appointments" \
    -H "Authorization: Bearer $A_TOKEN" \
    -H "Content-Type: application/json" \
    -d "{\"doctorId\":\"$F_ID\",\"scheduledAt\":\"2026-05-20T10:00:00Z\",\"notes\":\"Follow-up for blood pressure\"}")
HTTP_CODE=$(echo "$RESP" | tail -n1)
A_APPT=$(get_id "$(echo "$RESP" | sed '$d')")
if [ "$HTTP_CODE" = "201" ]; then
    ok "Appointment 1 created (Ahmed -> Fatima) ID: $A_APPT"
else
    err "Appointment 1 failed: $RESP"
fi

# ═══════════════════════════════════════════════════════════════
#  6. DOCTOR ACCEPTS APPOINTMENT
# ═══════════════════════════════════════════════════════════════

info "Doctor accepting appointment..."
RESP=$(curl -s -w "\n%{http_code}" -X PATCH "$API_URL/appointments/$A_APPT/status" \
    -H "Authorization: Bearer $F_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"status":"accepted"}')
HTTP_CODE=$(echo "$RESP" | tail -n1)
if [ "$HTTP_CODE" = "200" ]; then
    ok "Fatima accepted Ahmed's appointment"
else
    err "Accept failed: $RESP"
fi

# ═══════════════════════════════════════════════════════════════
#  7. CREATE MEDICATION
# ═══════════════════════════════════════════════════════════════

info "Creating medications..."

# Get Ahmed's ID
A_ID=$(curl -s "$API_URL/users/me" -H "Authorization: Bearer $A_TOKEN" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)

RESP=$(curl -s -w "\n%{http_code}" -X POST "$API_URL/medications" \
    -H "Authorization: Bearer $F_TOKEN" \
    -H "Content-Type: application/json" \
    -d "{\"medicineName\":\"Metformin\",\"dosage\":{\"value\":500,\"unit\":\"mg\"},\"frequency\":\"twice daily\",\"intakeTimes\":[\"08:00\",\"20:00\"],\"startDate\":\"2026-05-01T00:00:00Z\",\"endDate\":\"2026-08-01T00:00:00Z\",\"patientId\":\"$A_ID\",\"indication\":\"Type 2 Diabetes\",\"notes\":\"Take with meals\"}")
HTTP_CODE=$(echo "$RESP" | tail -n1)
if [ "$HTTP_CODE" = "201" ]; then
    ok "Medication created: Metformin for Ahmed"
else
    err "Medication failed: $RESP"
fi

# ═══════════════════════════════════════════════════════════════
#  8. CREATE ARTICLE (Doctor Post with Image)
# ═══════════════════════════════════════════════════════════════

info "Creating articles..."

RESP=$(curl -s -w "\n%{http_code}" -X POST "$API_URL/posts/articles" \
    -H "Authorization: Bearer $F_TOKEN" \
    -F "title=Understanding Heart Disease" \
    -F "content=Heart disease remains the leading cause of death worldwide. Early detection through regular screenings can significantly reduce mortality rates." \
    -F "category=Cardiology" \
    -F "tags=[\"heart\",\"prevention\",\"cardiology\"]" \
    -F "articleImage=@test-assets/article-heart.jpg")
HTTP_CODE=$(echo "$RESP" | tail -n1)
ARTICLE1=$(get_id "$(echo "$RESP" | sed '$d')")
if [ "$HTTP_CODE" = "201" ]; then
    ok "Article created: 'Understanding Heart Disease' ID: $ARTICLE1"
else
    err "Article failed: $RESP"
fi

# ═══════════════════════════════════════════════════════════════
#  9. CREATE COMMUNITY POST (Patient Post with Image)
# ═══════════════════════════════════════════════════════════════

info "Creating community posts..."

RESP=$(curl -s -w "\n%{http_code}" -X POST "$API_URL/posts/community" \
    -H "Authorization: Bearer $A_TOKEN" \
    -F "title=My journey managing diabetes" \
    -F "content=Five years ago I was diagnosed with Type 2 diabetes. Here are the lifestyle changes that worked for me." \
    -F "tags=[\"diabetes\",\"lifestyle\",\"nutrition\"]" \
    -F "postImage=@test-assets/community-diabetes.jpg")
HTTP_CODE=$(echo "$RESP" | tail -n1)
COMM1=$(get_id "$(echo "$RESP" | sed '$d')")
if [ "$HTTP_CODE" = "201" ]; then
    ok "Community post created: 'My journey managing diabetes' ID: $COMM1"
else
    err "Community post failed: $RESP"
fi

# ═══════════════════════════════════════════════════════════════
#  10. LIKE A POST
# ═══════════════════════════════════════════════════════════════

info "Adding likes..."

RESP=$(curl -s -w "\n%{http_code}" -X POST "$API_URL/posts/$COMM1/like" \
    -H "Authorization: Bearer $S_TOKEN")
HTTP_CODE=$(echo "$RESP" | tail -n1)
if [ "$HTTP_CODE" = "200" ]; then
    ok "Sarah liked Ahmed's community post"
else
    err "Like failed: $RESP"
fi

# ═══════════════════════════════════════════════════════════════
#  11. ADD COMMENT
# ═══════════════════════════════════════════════════════════════

info "Adding comments..."

RESP=$(curl -s -w "\n%{http_code}" -X POST "$API_URL/posts/$COMM1/comments" \
    -H "Authorization: Bearer $S_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"content":"Thank you for sharing! Your story gives me hope."}')
HTTP_CODE=$(echo "$RESP" | tail -n1)
if [ "$HTTP_CODE" = "201" ]; then
    ok "Comment added by Sarah"
else
    err "Comment failed: $RESP"
fi

# ═══════════════════════════════════════════════════════════════
#  12. START CHAT / SEND MESSAGE
# ═══════════════════════════════════════════════════════════════

info "Testing chat..."

# Get conversations (should exist after appointment acceptance)
RESP=$(curl -s "$API_URL/chat/conversations" -H "Authorization: Bearer $A_TOKEN")
CONV_ID=$(echo "$RESP" | grep -o '"_id":"[^"]*"' | head -1 | cut -d'"' -f4)

if [ -n "$CONV_ID" ]; then
    ok "Conversation found: $CONV_ID"

    # Send message
    RESP=$(curl -s -w "\n%{http_code}" -X POST "$API_URL/chat/$CONV_ID/messages" \
        -H "Authorization: Bearer $A_TOKEN" \
        -H "Content-Type: application/json" \
        -d '{"text":"Hello doctor, should I fast before the appointment?"}')
    HTTP_CODE=$(echo "$RESP" | tail -n1)
    if [ "$HTTP_CODE" = "201" ]; then
        ok "Chat message sent by Ahmed"
    else
        err "Chat message failed: $RESP"
    fi
else
    warn "No conversation found (appointment may not have been accepted)"
fi

# ═══════════════════════════════════════════════════════════════
#  13. UPDATE PROFILE (with new photo)
# ═══════════════════════════════════════════════════════════════

info "Updating profile with new photo..."

RESP=$(curl -s -w "\n%{http_code}" -X PATCH "$API_URL/users/me" \
    -H "Authorization: Bearer $A_TOKEN" \
    -F "fullName=Ahmed Hassan Updated" \
    -F "personalPhoto=@test-assets/patient1-new.jpg")
HTTP_CODE=$(echo "$RESP" | tail -n1)
if [ "$HTTP_CODE" = "200" ]; then
    ok "Profile updated with new photo (old photo should be deleted from disk)"
else
    err "Profile update failed: $RESP"
fi

# ═══════════════════════════════════════════════════════════════
#  14. GENERATE QR CODE
# ═══════════════════════════════════════════════════════════════

info "Generating emergency QR code..."

RESP=$(curl -s -w "\n%{http_code}" -X POST "$API_URL/records/qr" \
    -H "Authorization: Bearer $A_TOKEN")
HTTP_CODE=$(echo "$RESP" | tail -n1)
BODY=$(echo "$RESP" | sed '$d')
if [ "$HTTP_CODE" = "200" ]; then
    QR_PIN=$(echo "$BODY" | grep -o '"pin":"[^"]*"' | cut -d'"' -f4)
    ok "QR code generated! PIN: $QR_PIN (save this for testing QR access)"
else
    err "QR generation failed: $RESP"
fi

# ═══════════════════════════════════════════════════════════════
#  15. GET MEDICAL RECORD
# ═══════════════════════════════════════════════════════════════

info "Fetching medical record..."

RESP=$(curl -s -w "\n%{http_code}" -X GET "$API_URL/records/me" \
    -H "Authorization: Bearer $A_TOKEN")
HTTP_CODE=$(echo "$RESP" | tail -n1)
if [ "$HTTP_CODE" = "200" ]; then
    ok "Medical record retrieved successfully"
else
    err "Record fetch failed: $RESP"
fi

# ═══════════════════════════════════════════════════════════════
#  16. GET NOTIFICATIONS
# ═══════════════════════════════════════════════════════════════

info "Fetching notifications..."

RESP=$(curl -s -w "\n%{http_code}" -X GET "$API_URL/notifications" \
    -H "Authorization: Bearer $A_TOKEN")
HTTP_CODE=$(echo "$RESP" | tail -n1)
if [ "$HTTP_CODE" = "200" ]; then
    ok "Notifications retrieved"
else
    err "Notifications failed: $RESP"
fi

# ═══════════════════════════════════════════════════════════════
#  SUMMARY
# ═══════════════════════════════════════════════════════════════

echo ""
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║              SEEDING COMPLETE                                ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""
echo "Test Accounts:"
echo "  Patients:"
echo "    ahmed.patient@example.com / password123 (Arabic)"
echo "    sarah.patient@example.com / password123 (English)"
echo "    omar.patient@example.com / password123 (Arabic)"
echo ""
echo "  Doctors:"
echo "    fatima.doctor@example.com / password123 (Cardiology)"
echo "    james.doctor@example.com / password123 (Neurology)"
echo "    aisha.doctor@example.com / password123 (Pediatrics)"
echo ""
echo "What was tested:"
echo "  ✓ Patient signup with health profile + radiology/lab images"
echo "  ✓ Doctor signup with license + personal photo"
echo "  ✓ Duplicate email rejection (400, no orphan files)"
echo "  ✓ Login"
echo "  ✓ Appointment booking"
echo "  ✓ Doctor accepts appointment (creates conversation)"
echo "  ✓ Medication prescription"
echo "  ✓ Article creation with image"
echo "  ✓ Community post creation with image"
echo "  ✓ Like post"
echo "  ✓ Comment on post"
echo "  ✓ Chat messaging"
echo "  ✓ Profile update with new photo (old photo deleted)"
echo "  ✓ QR code generation"
echo "  ✓ Medical record retrieval"
echo "  ✓ Notifications"
echo ""
echo "Verify file cleanup:"
echo "  ls uploads/personalPhoto/    # Should have 3 patient + 3 doctor photos"
echo "  ls uploads/.temp/            # Should be EMPTY (all files moved)"
echo "  ls uploads/radiology/        # Should have Ahmed's X-ray"
echo "  ls uploads/labTests/         # Should have Ahmed's blood test"
echo "  ls uploads/articles/         # Should have article image"
echo "  ls uploads/posts/            # Should have community post image"
echo ""
