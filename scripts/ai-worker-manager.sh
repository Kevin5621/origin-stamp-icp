#!/bin/bash

# AI Verification Service Health Check & Management Script

set -e

WORKER_DIR="services/ai-verification-worker"
PID_FILE="$WORKER_DIR/worker.pid"
LOG_FILE="$WORKER_DIR/worker.log"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}🔍 $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

check_service_health() {
    print_status "AI Verification Service Health Check"
    echo "============================================="
    
    # Check if worker directory exists
    if [ ! -d "$WORKER_DIR" ]; then
        print_error "Worker directory not found: $WORKER_DIR"
        return 1
    fi
    
    cd "$WORKER_DIR"
    
    # Check Python environment
    print_status "Checking Python environment..."
    if [ ! -d "venv" ]; then
        print_warning "Virtual environment not found. Creating..."
        python3 -m venv venv
    fi
    
    source venv/bin/activate
    
    # Check Python version
    python_version=$(python3 --version)
    print_success "Python version: $python_version"
    
    # Check dependencies
    print_status "Checking dependencies..."
    missing_deps=()
    
    if ! python3 -c "import aiohttp" 2>/dev/null; then
        missing_deps+=("aiohttp")
    fi
    
    if ! python3 -c "import httpx" 2>/dev/null; then
        missing_deps+=("httpx")
    fi
    
    if ! python3 -c "import PIL" 2>/dev/null; then
        missing_deps+=("Pillow")
    fi
    
    if ! python3 -c "from dotenv import load_dotenv" 2>/dev/null; then
        missing_deps+=("python-dotenv")
    fi
    
    if [ ${#missing_deps[@]} -gt 0 ]; then
        print_warning "Missing dependencies: ${missing_deps[*]}"
        print_status "Installing missing dependencies..."
        pip install -r requirements.txt
    else
        print_success "All dependencies installed"
    fi
    
    # Check environment variables
    print_status "Checking environment variables..."
    source ../../.env 2>/dev/null || true
    
    if [ -z "$CEREBRAS_API_KEY" ]; then
        print_error "CEREBRAS_API_KEY not set in .env file"
        return 1
    else
        key_preview="${CEREBRAS_API_KEY:0:8}..."
        print_success "CEREBRAS_API_KEY: $key_preview"
    fi
    
    if [ -z "$CANISTER_CALLBACK_URL" ]; then
        print_warning "CANISTER_CALLBACK_URL not set, using default"
        export CANISTER_CALLBACK_URL="http://localhost:8000"
    fi
    print_success "CANISTER_CALLBACK_URL: $CANISTER_CALLBACK_URL"
    
    # Check if worker is running
    print_status "Checking worker process..."
    if [ -f "$PID_FILE" ]; then
        worker_pid=$(cat "$PID_FILE")
        if ps -p "$worker_pid" > /dev/null 2>&1; then
            print_success "Worker running with PID: $worker_pid"
            
            # Check worker responsiveness
            if [ -f "$LOG_FILE" ]; then
                last_log=$(tail -1 "$LOG_FILE" 2>/dev/null || echo "")
                if [ -n "$last_log" ]; then
                    print_success "Worker logs are active"
                fi
            fi
        else
            print_warning "PID file exists but process not running"
            rm -f "$PID_FILE"
        fi
    else
        print_warning "Worker not running"
    fi
    
    # Test worker functionality
    print_status "Testing worker functionality..."
    if python3 -c "from simple_worker import SimpleVerificationWorker; print('Worker import: OK')" 2>/dev/null; then
        print_success "Worker import test passed"
    else
        print_error "Worker import test failed"
        return 1
    fi
    
    print_success "Health check completed successfully!"
    return 0
}

start_worker() {
    print_status "Starting AI Verification Worker..."
    
    # Create worker directory if it doesn't exist
    mkdir -p "$WORKER_DIR"
    cd "$WORKER_DIR"
    
    # Check if already running
    if [ -f "worker.pid" ]; then
        worker_pid=$(cat "worker.pid")
        if ps -p "$worker_pid" > /dev/null 2>&1; then
            print_warning "Worker already running with PID: $worker_pid"
            return 0
        else
            rm -f "worker.pid"
        fi
    fi
    
    # Ensure virtual environment
    if [ ! -d "venv" ]; then
        python3 -m venv venv
    fi
    
    source venv/bin/activate
    
    # Load environment variables from root .env file
    ROOT_DIR=$(cd ../../ && pwd)
    ENV_FILE="$ROOT_DIR/.env"
    if [ -f "$ENV_FILE" ]; then
        export $(cat "$ENV_FILE" | grep -v '^#' | xargs)
        print_status "Environment variables loaded from $ENV_FILE"
    else
        print_warning ".env file not found at $ENV_FILE"
    fi
    
    # Verify CEREBRAS_API_KEY is set
    if [ -z "$CEREBRAS_API_KEY" ]; then
        print_error "CEREBRAS_API_KEY not found in environment"
        return 1
    fi
    
    # Start worker in background with environment variables
    env CEREBRAS_API_KEY="$CEREBRAS_API_KEY" \
        CANISTER_CALLBACK_URL="${CANISTER_CALLBACK_URL:-http://localhost:8000}" \
        nohup python3 worker.py > "worker.log" 2>&1 &
    worker_pid=$!
    echo $worker_pid > "worker.pid"
    
    # Wait a bit and check if it started successfully
    sleep 3
    if ps -p "$worker_pid" > /dev/null 2>&1; then
        print_success "Worker started successfully with PID: $worker_pid"
        print_status "Log file: $(pwd)/worker.log"
    else
        print_error "Failed to start worker. Check log: $(pwd)/worker.log"
        if [ -f "worker.log" ]; then
            print_status "Last few log lines:"
            tail -5 "worker.log"
        fi
        rm -f "worker.pid"
        return 1
    fi
}

stop_worker() {
    print_status "Stopping AI Verification Worker..."
    
    cd "$WORKER_DIR" 2>/dev/null || return 1
    
    if [ -f "worker.pid" ]; then
        worker_pid=$(cat "worker.pid")
        if ps -p "$worker_pid" > /dev/null 2>&1; then
            kill "$worker_pid"
            sleep 2
            
            # Force kill if still running
            if ps -p "$worker_pid" > /dev/null 2>&1; then
                kill -9 "$worker_pid"
                print_warning "Force killed worker process"
            else
                print_success "Worker stopped gracefully"
            fi
        else
            print_warning "Worker process not found"
        fi
        rm -f "worker.pid"
    else
        print_warning "Worker PID file not found"
    fi
}

restart_worker() {
    print_status "Restarting AI Verification Worker..."
    stop_worker
    sleep 1
    start_worker
}

show_logs() {
    if [ -f "$LOG_FILE" ]; then
        print_status "Showing worker logs (last 50 lines):"
        echo "----------------------------------------"
        tail -50 "$LOG_FILE"
    else
        print_warning "Log file not found: $LOG_FILE"
    fi
}

run_tests() {
    print_status "Running AI Verification Tests..."
    cd "$WORKER_DIR"
    
    if [ ! -d "venv" ]; then
        python3 -m venv venv
    fi
    
    source venv/bin/activate
    source ../../.env 2>/dev/null || true
    
    # Run tests
    python3 test_e2e.py
}

show_status() {
    print_status "AI Verification Service Status"
    echo "==============================="
    
    # Worker process status
    if [ -f "$PID_FILE" ]; then
        worker_pid=$(cat "$PID_FILE")
        if ps -p "$worker_pid" > /dev/null 2>&1; then
            print_success "Status: RUNNING (PID: $worker_pid)"
            
            # Show resource usage
            cpu_usage=$(ps -p "$worker_pid" -o %cpu --no-headers 2>/dev/null || echo "N/A")
            mem_usage=$(ps -p "$worker_pid" -o %mem --no-headers 2>/dev/null || echo "N/A")
            print_status "CPU Usage: ${cpu_usage}%"
            print_status "Memory Usage: ${mem_usage}%"
            
            # Show uptime
            start_time=$(ps -p "$worker_pid" -o lstart --no-headers 2>/dev/null || echo "N/A")
            print_status "Started: $start_time"
        else
            print_error "Status: STOPPED (PID file exists but process not running)"
        fi
    else
        print_error "Status: STOPPED"
    fi
    
    # Log file status
    if [ -f "$LOG_FILE" ]; then
        log_size=$(ls -lh "$LOG_FILE" | awk '{print $5}')
        log_lines=$(wc -l < "$LOG_FILE")
        print_status "Log file: $log_size ($log_lines lines)"
        
        # Show recent activity
        if [ "$log_lines" -gt 0 ]; then
            last_entry=$(tail -1 "$LOG_FILE" 2>/dev/null)
            print_status "Last log entry: $last_entry"
        fi
    else
        print_warning "No log file found"
    fi
}

# Main command handling
case "${1:-}" in
    "health"|"check")
        check_service_health
        ;;
    "start")
        start_worker
        ;;
    "stop")
        stop_worker
        ;;
    "restart")
        restart_worker
        ;;
    "status")
        show_status
        ;;
    "logs")
        show_logs
        ;;
    "test")
        run_tests
        ;;
    "setup")
        print_status "Setting up AI Verification Service..."
        check_service_health && start_worker
        ;;
    *)
        echo "AI Verification Service Management"
        echo "=================================="
        echo "Usage: $0 {health|start|stop|restart|status|logs|test|setup}"
        echo ""
        echo "Commands:"
        echo "  health    - Check service health and dependencies"
        echo "  start     - Start the worker service"
        echo "  stop      - Stop the worker service"
        echo "  restart   - Restart the worker service"
        echo "  status    - Show current service status"
        echo "  logs      - Show recent worker logs"
        echo "  test      - Run end-to-end tests"
        echo "  setup     - Initial setup and start"
        echo ""
        echo "Examples:"
        echo "  $0 setup     # First time setup"
        echo "  $0 health    # Check if everything is working"
        echo "  $0 test      # Run verification tests"
        echo "  $0 logs      # Check worker activity"
        exit 1
        ;;
esac
