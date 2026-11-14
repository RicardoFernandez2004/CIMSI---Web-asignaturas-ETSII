#!/usr/bin/env bash
# ==============================================================================
# Proyecto CIMSI - Script de Despliegue Automatizado (deploy.sh)
# Ubicación: /infra/deploy.sh
# Responsable: Persona 5 (Pareja 3 - Automatización y Escalado)
# ==============================================================================

set -euo pipefail

# Obtener directorio del script y raíz del repositorio
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"

# Colores para salida formateada en consola
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() { echo -e "${BLUE}[INFO]${NC} $1"; }
log_success() { echo -e "${GREEN}[OK]${NC} $1"; }
log_warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

show_help() {
    cat << EOF
Uso: ./deploy.sh [OPCIÓN]

Script de automatización para el despliegue del Proyecto CIMSI.

Opciones de despliegue:
  full       Despliega el clúster completo (Persistencia + Backend) en local.
  db         Despliega únicamente la capa de persistencia PostgreSQL (para MV3).
  backend    Despliega únicamente los microservicios FastAPI (para MV2).
  replica    Despliega el nodo réplica de alta disponibilidad (para MV4).
  down       Detiene y elimina los contenedores activos.
  status     Muestra el estado de salud de los contenedores.
  -h, --help Muestra esta ayuda.

Ejemplos:
  ./deploy.sh full
  ./deploy.sh db
  ./deploy.sh backend
EOF
}

check_prerequisites() {
    log_info "Comprobando requisitos previos del sistema..."
    if ! command -v docker &> /dev/null; then
        log_error "Docker no está instalado en este sistema."
        exit 1
    fi

    if ! docker compose version &> /dev/null; then
        log_error "Docker Compose (plugin v2) no está disponible."
        exit 1
    fi
    log_success "Docker y Docker Compose detectados correctamente."
}

check_env_file() {
    log_info "Verificando fichero de variables de entorno..."
    if [ ! -f "${SCRIPT_DIR}/.env" ]; then
        if [ -f "${SCRIPT_DIR}/.env.example" ]; then
            log_warn "No se encontró infra/.env. Copiando desde infra/.env.example..."
            cp "${SCRIPT_DIR}/.env.example" "${SCRIPT_DIR}/.env"
            log_success "Fichero infra/.env generado automáticamente."
        else
            log_warn "No existe infra/.env.example. Se usarán las variables fallback predeterminadas."
        fi
    else
        log_success "Fichero infra/.env detectado."
    fi
}

deploy_profile() {
    local profile="$1"
    log_info "Iniciando despliegue automatizado con perfil: [${profile}]..."
    
    cd "${PROJECT_ROOT}"

    ENV_FILE_OPTION=""
    if [ -f "${SCRIPT_DIR}/.env" ]; then
        ENV_FILE_OPTION="--env-file ${SCRIPT_DIR}/.env"
    fi

    case "${profile}" in
        full)
            docker compose ${ENV_FILE_OPTION} -f "${SCRIPT_DIR}/docker-compose.yml" --profile full up -d --build
            ;;
        db)
            docker compose ${ENV_FILE_OPTION} -f "${SCRIPT_DIR}/docker-compose.yml" --profile db up -d --build
            ;;
        backend)
            docker compose ${ENV_FILE_OPTION} -f "${SCRIPT_DIR}/docker-compose.yml" --profile backend up -d --build
            ;;
        replica)
            log_info "Desplegando nodo réplica de Feedback Service..."
            docker compose ${ENV_FILE_OPTION} -f "${SCRIPT_DIR}/docker-compose.yml" up -d --build feedback-service
            ;;
        *)
            log_error "Perfil de despliegue no válido: ${profile}"
            show_help
            exit 1
            ;;
    esac

    log_success "Despliegue finalizado con éxito para el perfil [${profile}]."
}

stop_services() {
    log_info "Deteniendo y limpiando contenedores del clúster..."
    cd "${PROJECT_ROOT}"
    docker compose -f "${SCRIPT_DIR}/docker-compose.yml" --profile full down
    log_success "Todos los servicios se han detenido correctamente."
}

show_status() {
    log_info "Comprobando estado actual de los contenedores..."
    cd "${PROJECT_ROOT}"
    docker compose -f "${SCRIPT_DIR}/docker-compose.yml" ps
}

main() {
    if [ $# -eq 0 ]; then
        show_help
        exit 0
    fi

    case "$1" in
        full|db|backend|replica)
            check_prerequisites
            check_env_file
            deploy_profile "$1"
            show_status
            ;;
        down)
            stop_services
            ;;
        status)
            show_status
            ;;
        -h|--help)
            show_help
            ;;
        *)
            log_error "Opción no reconocida: $1"
            show_help
            exit 1
            ;;
    esac
}

main "$@"
