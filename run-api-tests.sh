#!/bin/bash

# QuickSME API Testing Script
# This script runs comprehensive API tests using Newman

set -e

echo "🧪 QuickSME API Testing Script"
echo "=============================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Newman is installed
if ! command -v newman &> /dev/null; then
    print_error "Newman is not installed. Installing..."
    if command -v npm &> /dev/null; then
        npm install -g newman newman-reporter-htmlextra
        print_success "Newman installed successfully"
    else
        print_error "npm is not available. Please install Node.js and npm first."
        exit 1
    fi
fi

# Check if Docker is running
if ! docker info &> /dev/null; then
    print_error "Docker is not running. Please start Docker Desktop."
    exit 1
fi

# Function to wait for service
wait_for_service() {
    local url=$1
    local service_name=$2
    local max_attempts=30
    local attempt=1

    print_status "Waiting for $service_name to be ready..."

    while [ $attempt -le $max_attempts ]; do
        if curl -f -s "$url" > /dev/null 2>&1; then
            print_success "$service_name is ready!"
            return 0
        fi

        echo -n "."
        sleep 2
        ((attempt++))
    done

    print_error "$service_name failed to start after $max_attempts attempts"
    return 1
}

# Function to run tests
run_test_suite() {
    local test_name=$1
    local folder=$2
    local iterations=${3:-1}
    local delay=${4:-100}

    print_status "Running $test_name..."

    local cmd="newman run QuickSME_API_Tests.postman_collection.json \
        --environment QuickSME_Test_Env.postman_environment.json \
        --reporters cli,htmlextra,json \
        --reporter-htmlextra-export ${test_name,,}-results.html \
        --reporter-json-export ${test_name,,}-results.json \
        --timeout 30000 \
        --delay-request $delay"

    if [ "$folder" != "all" ]; then
        cmd="$cmd --folder \"$folder\""
    fi

    if [ "$iterations" -gt 1 ]; then
        cmd="$cmd --iteration-count $iterations"
    fi

    if eval "$cmd"; then
        print_success "$test_name completed successfully"

        # Show summary
        if [ -f "${test_name,,}-results.json" ]; then
            local total=$(jq '.run.stats.requests.total' "${test_name,,}-results.json")
            local passed=$(jq '.run.stats.requests.passed' "${test_name,,}-results.json")
            local failed=$(jq '.run.stats.requests.failed' "${test_name,,}-results.json")

            echo "📊 Results: $passed/$total passed, $failed failed"
        fi

        return 0
    else
        print_error "$test_name failed"
        return 1
    fi
}

# Main menu
show_menu() {
    echo ""
    echo "Select test type:"
    echo "1) Full API Test Suite"
    echo "2) Functional Tests Only"
    echo "3) Load Tests"
    echo "4) Security & Error Tests"
    echo "5) Quick Health Check"
    echo "6) Setup Environment Only"
    echo "7) Exit"
    echo ""
}

# Setup environment
setup_environment() {
    print_status "Setting up test environment..."

    # Start services
    print_status "Starting PostgreSQL and application..."
    docker-compose -f docker-compose.postgres.yml up -d

    # Wait for services
    wait_for_service "http://localhost:5432" "PostgreSQL"
    wait_for_service "http://localhost:3000/health" "QuickSME API"

    print_success "Environment setup complete!"
}

# Cleanup function
cleanup() {
    print_status "Cleaning up..."
    docker-compose -f docker-compose.postgres.yml down || true
    print_success "Cleanup complete"
}

# Trap for cleanup on exit
trap cleanup EXIT

# Main script
main() {
    local choice
    local test_failed=false

    while true; do
        show_menu
        read -p "Enter your choice (1-7): " choice

        case $choice in
            1)
                print_status "Running Full API Test Suite..."
                setup_environment

                run_test_suite "Functional" "Ledgers API" || test_failed=true
                run_test_suite "Functional" "Parties API" || test_failed=true
                run_test_suite "Functional" "Vouchers API" || test_failed=true
                run_test_suite "Functional" "Stock Items API" || test_failed=true
                run_test_suite "Functional" "API Keys API" || test_failed=true
                run_test_suite "Functional" "Webhooks API" || test_failed=true
                run_test_suite "Functional" "AI Assistant API" || test_failed=true
                run_test_suite "Load" "Load Testing Scenarios" 20 500 || test_failed=true
                run_test_suite "Security" "Error Testing" || test_failed=true

                if [ "$test_failed" = false ]; then
                    print_success "All tests passed! 🎉"
                else
                    print_error "Some tests failed. Check the results above."
                fi
                ;;
            2)
                print_status "Running Functional Tests..."
                setup_environment

                run_test_suite "Functional" "all" || test_failed=true

                if [ "$test_failed" = false ]; then
                    print_success "Functional tests passed! ✅"
                fi
                ;;
            3)
                print_status "Running Load Tests..."
                setup_environment

                run_test_suite "Load" "Load Testing Scenarios" 100 200 || test_failed=true

                if [ "$test_failed" = false ]; then
                    print_success "Load tests completed! 🚀"
                fi
                ;;
            4)
                print_status "Running Security & Error Tests..."
                setup_environment

                run_test_suite "Security" "Error Testing" || test_failed=true

                if [ "$test_failed" = false ]; then
                    print_success "Security tests passed! 🔒"
                fi
                ;;
            5)
                print_status "Running Quick Health Check..."
                setup_environment

                if curl -f -s "http://localhost:3000/health" > /dev/null; then
                    print_success "API is healthy! 💚"
                else
                    print_error "API health check failed"
                fi
                ;;
            6)
                setup_environment
                print_success "Environment is ready. Run your own tests now."
                print_status "API URL: http://localhost:3000"
                print_status "Press Ctrl+C to stop services"
                wait
                ;;
            7)
                print_status "Goodbye! 👋"
                exit 0
                ;;
            *)
                print_error "Invalid choice. Please enter 1-7."
                ;;
        esac
    done
}

# Run main function
main "$@"
