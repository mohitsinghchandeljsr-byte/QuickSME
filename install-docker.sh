#!/bin/bash

# QuickSME ERP Installation Script
# This script sets up the QuickSME ERP system using Docker

set -e

echo "🚀 QuickSME ERP Installation Script"
echo "=================================="

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first:"
    echo "   - Download from: https://www.docker.com/get-started"
    echo "   - Or use your system's package manager"
    exit 1
fi

# Check if Docker Compose is available
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo "❌ Docker Compose is not available. Please install Docker Compose."
    exit 1
fi

echo "✅ Docker and Docker Compose are installed"

# Function to run PostgreSQL setup
run_postgres() {
    echo "🐘 Setting up QuickSME with PostgreSQL..."
    echo "This will start the application with PostgreSQL database"

    # Stop any existing containers
    docker-compose -f docker-compose.postgres.yml down || true

    # Start the services
    docker-compose -f docker-compose.postgres.yml up -d

    echo "✅ PostgreSQL setup complete!"
    echo "🌐 Application: http://localhost:3000"
    echo "📊 Grafana: http://localhost:3001 (admin/admin)"
    echo "📈 Prometheus: http://localhost:9090"
    echo "🔍 cAdvisor: http://localhost:8080"
    echo "🤖 Model Monitor: http://localhost:8000"
}

# Function to run MySQL setup
run_mysql() {
    echo "🗄️  Setting up QuickSME with MySQL..."
    echo "This will start the application with MySQL database"

    # Stop any existing containers
    docker-compose -f docker-compose.mysql.yml down || true

    # Start the services
    docker-compose -f docker-compose.mysql.yml up -d

    echo "✅ MySQL setup complete!"
    echo "🌐 Application: http://localhost:3000"
    echo "📊 Grafana: http://localhost:3001 (admin/admin)"
    echo "📈 Prometheus: http://localhost:9090"
    echo "🔍 cAdvisor: http://localhost:8080"
    echo "🤖 Model Monitor: http://localhost:8000"
}

# Function to stop all services
stop_services() {
    echo "🛑 Stopping all QuickSME services..."

    docker-compose -f docker-compose.postgres.yml down || true
    docker-compose -f docker-compose.mysql.yml down || true

    echo "✅ All services stopped"
}

# Function to show status
show_status() {
    echo "📊 QuickSME Services Status:"
    echo "=========================="

    echo "PostgreSQL Setup:"
    docker-compose -f docker-compose.postgres.yml ps || echo "Not running"

    echo ""
    echo "MySQL Setup:"
    docker-compose -f docker-compose.mysql.yml ps || echo "Not running"
}

# Function to show logs
show_logs() {
    echo "📋 QuickSME Logs:"
    echo "Choose which service logs to view:"
    echo "1) PostgreSQL setup logs"
    echo "2) MySQL setup logs"
    read -p "Enter choice (1-2): " choice

    case $choice in
        1)
            docker-compose -f docker-compose.postgres.yml logs -f
            ;;
        2)
            docker-compose -f docker-compose.mysql.yml logs -f
            ;;
        *)
            echo "Invalid choice"
            ;;
    esac
}

# Main menu
while true; do
    echo ""
    echo "Choose an option:"
    echo "1) Install with PostgreSQL"
    echo "2) Install with MySQL"
    echo "3) Stop all services"
    echo "4) Show status"
    echo "5) Show logs"
    echo "6) Exit"
    echo ""

    read -p "Enter your choice (1-6): " choice

    case $choice in
        1)
            run_postgres
            ;;
        2)
            run_mysql
            ;;
        3)
            stop_services
            ;;
        4)
            show_status
            ;;
        5)
            show_logs
            ;;
        6)
            echo "👋 Goodbye!"
            exit 0
            ;;
        *)
            echo "❌ Invalid choice. Please enter 1-6."
            ;;
    esac
done
