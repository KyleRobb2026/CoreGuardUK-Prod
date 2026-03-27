#!/bin/bash

# ========================================
# CoreGuard UK - Production Deployment Script
# ========================================
# This script helps deploy the CoreGuard UK application to production
# Usage: ./deploy-production.sh [backend|frontend|both]

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
BACKEND_DIR="backend"
FRONTEND_DIR="frontend"
DEPLOYMENT_TYPE=${1:-both}

echo -e "${BLUE}🚀 CoreGuard UK Production Deployment${NC}"
echo -e "${YELLOW}Deployment type: $DEPLOYMENT_TYPE${NC}"
echo ""

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check prerequisites
check_prerequisites() {
    echo -e "${BLUE}📋 Checking prerequisites...${NC}"
    
    # Check Node.js
    if ! command_exists node; then
        echo -e "${RED}❌ Node.js is not installed${NC}"
        exit 1
    fi
    echo -e "${GREEN}✅ Node.js: $(node --version)${NC}"
    
    # Check npm
    if ! command_exists npm; then
        echo -e "${RED}❌ npm is not installed${NC}"
        exit 1
    fi
    echo -e "${GREEN}✅ npm: $(npm --version)${NC}"
    
    # Check git
    if ! command_exists git; then
        echo -e "${RED}❌ git is not installed${NC}"
        exit 1
    fi
    echo -e "${GREEN}✅ git: $(git --version)${NC}"
    
    # Check if directories exist
    if [[ "$DEPLOYMENT_TYPE" == "backend" || "$DEPLOYMENT_TYPE" == "both" ]]; then
        if [[ ! -d "$BACKEND_DIR" ]]; then
            echo -e "${RED}❌ Backend directory not found: $BACKEND_DIR${NC}"
            exit 1
        fi
    fi
    
    if [[ "$DEPLOYMENT_TYPE" == "frontend" || "$DEPLOYMENT_TYPE" == "both" ]]; then
        if [[ ! -d "$FRONTEND_DIR" ]]; then
            echo -e "${RED}❌ Frontend directory not found: $FRONTEND_DIR${NC}"
            exit 1
        fi
    fi
    
    echo -e "${GREEN}✅ All prerequisites met${NC}"
    echo ""
}

# Function to deploy backend
deploy_backend() {
    echo -e "${BLUE}🔧 Deploying Backend to Railway...${NC}"
    
    cd "$BACKEND_DIR"
    
    # Check if Railway CLI is installed
    if ! command_exists railway; then
        echo -e "${YELLOW}📦 Installing Railway CLI...${NC}"
        npm install -g @railway/cli
    fi
    
    # Check if logged in to Railway
    if ! railway whoami >/dev/null 2>&1; then
        echo -e "${YELLOW}🔐 Please login to Railway...${NC}"
        railway login
    fi
    
    # Install dependencies
    echo -e "${YELLOW}📦 Installing backend dependencies...${NC}"
    npm ci --production
    
    # Run tests if they exist
    if [[ -f "package.json" ]] && grep -q "test" package.json; then
        echo -e "${YELLOW}🧪 Running backend tests...${NC}"
        npm test
    fi
    
    # Deploy to Railway
    echo -e "${YELLOW}🚀 Deploying to Railway...${NC}"
    railway up
    
    echo -e "${GREEN}✅ Backend deployed successfully!${NC}"
    cd ..
    echo ""
}

# Function to deploy frontend
deploy_frontend() {
    echo -e "${BLUE}🎨 Deploying Frontend to Vercel...${NC}"
    
    cd "$FRONTEND_DIR"
    
    # Check if Vercel CLI is installed
    if ! command_exists vercel; then
        echo -e "${YELLOW}📦 Installing Vercel CLI...${NC}"
        npm install -g vercel
    fi
    
    # Check if logged in to Vercel
    if ! vercel whoami >/dev/null 2>&1; then
        echo -e "${YELLOW}🔐 Please login to Vercel...${NC}"
        vercel login
    fi
    
    # Install dependencies
    echo -e "${YELLOW}📦 Installing frontend dependencies...${NC}"
    npm ci
    
    # Run tests if they exist
    if [[ -f "package.json" ]] && grep -q "test" package.json; then
        echo -e "${YELLOW}🧪 Running frontend tests...${NC}"
        npm test
    fi
    
    # Build frontend
    echo -e "${YELLOW}🏗️ Building frontend...${NC}"
    npm run build
    
    # Deploy to Vercel
    echo -e "${YELLOW}🚀 Deploying to Vercel...${NC}"
    vercel --prod
    
    echo -e "${GREEN}✅ Frontend deployed successfully!${NC}"
    cd ..
    echo ""
}

# Function to verify deployment
verify_deployment() {
    echo -e "${BLUE}🔍 Verifying deployment...${NC}"
    
    # Get deployment URLs
    BACKEND_URL="https://coreguard-uk-backend-production.up.railway.app"
    FRONTEND_URL="https://www.coreguard-uk.co.uk"
    
    # Test backend health
    echo -e "${YELLOW}🏥 Testing backend health...${NC}"
    if curl -f -s "$BACKEND_URL/health" >/dev/null; then
        echo -e "${GREEN}✅ Backend health check passed${NC}"
    else
        echo -e "${RED}❌ Backend health check failed${NC}"
        echo -e "${YELLOW}Check Railway logs: https://railway.app/project/coreguard-uk-backend/logs${NC}"
    fi
    
    # Test frontend
    echo -e "${YELLOW}🌐 Testing frontend...${NC}"
    if curl -f -s "$FRONTEND_URL" >/dev/null; then
        echo -e "${GREEN}✅ Frontend is accessible${NC}"
    else
        echo -e "${RED}❌ Frontend is not accessible${NC}"
        echo -e "${YELLOW}Check Vercel logs: https://vercel.com/dashboard/coreguard-uk/logs${NC}"
    fi
    
    echo ""
    echo -e "${GREEN}🎉 Deployment verification complete!${NC}"
    echo -e "${BLUE}📱 Backend: $BACKEND_URL${NC}"
    echo -e "${BLUE}🌐 Frontend: $FRONTEND_URL${NC}"
}

# Function to show post-deployment checklist
show_checklist() {
    echo -e "${BLUE}📋 Post-Deployment Checklist:${NC}"
    echo ""
    echo "🔧 Backend (Railway):"
    echo "  □ Verify all environment variables are set"
    echo "  □ Check database connectivity"
    echo "  □ Test authentication endpoints"
    echo "  □ Verify email functionality"
    echo ""
    echo "🎨 Frontend (Vercel):"
    echo "  □ Verify API URL is correct"
    echo "  □ Test authentication flow"
    echo "  □ Check responsive design"
    echo "  □ Verify all pages load correctly"
    echo ""
    echo "🔒 Security:"
    echo "  □ Test user signup/login"
    echo "  □ Verify email verification works"
    echo "  □ Test password reset flow"
    echo "  □ Check RBAC permissions"
    echo ""
    echo "📊 Monitoring:"
    echo "  □ Set up error monitoring"
    echo "  □ Configure logging"
    echo "  □ Set up alerts for failures"
    echo ""
}

# Main deployment flow
main() {
    check_prerequisites
    
    if [[ "$DEPLOYMENT_TYPE" == "backend" || "$DEPLOYMENT_TYPE" == "both" ]]; then
        deploy_backend
    fi
    
    if [[ "$DEPLOYMENT_TYPE" == "frontend" || "$DEPLOYMENT_TYPE" == "both" ]]; then
        deploy_frontend
    fi
    
    verify_deployment
    show_checklist
    
    echo -e "${GREEN}🎉 Production deployment complete!${NC}"
    echo -e "${BLUE}📚 For more information, see PRODUCTION_ENVIRONMENT.md${NC}"
}

# Run main function
main
