#!/usr/bin/env bash
# =============================================
# VSICS Project — Linux Setup Script
# Run: chmod +x setup.sh && ./setup.sh
# =============================================

set -e  # Exit on error

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔══════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   VSICS Online Learning Portal Setup   ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════╝${NC}"
echo ""

# Check Node.js
echo -e "${YELLOW}Checking Node.js...${NC}"
if ! command -v node &> /dev/null; then
  echo -e "${RED}Node.js not found. Install v18+ from https://nodejs.org${NC}"
  exit 1
fi
NODE_VER=$(node -v)
echo -e "${GREEN}✓ Node.js $NODE_VER found${NC}"

# Check MySQL
echo -e "${YELLOW}Checking MySQL...${NC}"
if ! command -v mysql &> /dev/null; then
  echo -e "${RED}MySQL not found. Install with:${NC}"
  echo "  sudo apt install mysql-server  # Ubuntu/Debian"
  echo "  sudo dnf install mysql-server  # Fedora/RHEL"
  exit 1
fi
echo -e "${GREEN}✓ MySQL found${NC}"

# ── Backend Setup ──
echo ""
echo -e "${BLUE}Setting up backend...${NC}"
cd backend

# Create .env if not present
if [ ! -f ".env" ]; then
  cp .env.example .env
  echo -e "${YELLOW}Created backend/.env — please edit DB credentials${NC}"
else
  echo -e "${GREEN}✓ backend/.env already exists${NC}"
fi

# Create uploads directory
mkdir -p uploads
chmod 755 uploads
echo -e "${GREEN}✓ uploads/ directory ready${NC}"

# Install dependencies
echo -e "${YELLOW}Installing backend dependencies...${NC}"
npm install
echo -e "${GREEN}✓ Backend dependencies installed${NC}"

# Run migrations
echo -e "${YELLOW}Running database migrations...${NC}"
npm run migrate
echo -e "${GREEN}✓ Database migrated and seeded${NC}"

cd ..

# ── Frontend Setup ──
echo ""
echo -e "${BLUE}Setting up frontend...${NC}"
cd frontend

if [ ! -f ".env" ]; then
  cp .env.example .env
  echo -e "${YELLOW}Created frontend/.env${NC}"
else
  echo -e "${GREEN}✓ frontend/.env already exists${NC}"
fi

echo -e "${YELLOW}Installing frontend dependencies...${NC}"
npm install
echo -e "${GREEN}✓ Frontend dependencies installed${NC}"

cd ..

# ── Done ──
echo ""
echo -e "${GREEN}╔══════════════════════════════════════╗${NC}"
echo -e "${GREEN}║            Setup Complete!              ║${NC}"
echo -e "${GREEN}╚══════════════════════════════════════╝${NC}"
echo ""
echo -e "Start the project with two terminals:"
echo -e "  ${BLUE}Terminal 1:${NC} cd backend && npm run dev"
echo -e "  ${BLUE}Terminal 2:${NC} cd frontend && npm run dev"
echo ""
echo -e "Then open ${BLUE}http://localhost:5173${NC} in your browser."
echo ""
echo -e "Login credentials:"
echo -e "  Admin:   ${YELLOW}admin@vsics.edu${NC} / ${YELLOW}lavi\$h.07${NC}"
echo -e "  Student: ${YELLOW}rahul@vsics.edu${NC} / ${YELLOW}lavi5h.07${NC}"
echo -e "  Faculty: ${YELLOW}rekh@vsics.edu${NC}  / ${YELLOW}RekhBCA402${NC}"
