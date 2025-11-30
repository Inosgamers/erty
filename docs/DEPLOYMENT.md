# Deployment Guide - Erty

## Requisitos

- **Docker & Docker Compose** (para deploy com containers)
- **Node.js 18+** (para deploy manual)
- **PostgreSQL 14+**
- **Redis 7+**
- **Flutter 3.0+** (para build mobile)

## Deploy com Docker (Recomendado)

### 1. Configuração Inicial

Clone o repositório:
```bash
git clone <repository-url>
cd erty
```

Configure as variáveis de ambiente:
```bash
cp erty-backend/.env.example erty-backend/.env
```

Edite `.env` com suas configurações de produção.

### 2. Build e Start

```bash
docker-compose up -d
```

Verificar status:
```bash
docker-compose ps
```

Ver logs:
```bash
docker-compose logs -f backend
```

### 3. Acesso

- **API:** http://localhost:3000
- **Health Check:** http://localhost:3000/health

## Deploy Manual

### Backend

1. **Instalar dependências:**
```bash
cd erty-backend
npm install --production
```

2. **Configurar banco de dados:**
```bash
# Execute migrations
npm run migrate
```

3. **Iniciar aplicação:**
```bash
npm start
```

### Mobile (Android)

1. **Build APK:**
```bash
cd erty-mobile
flutter build apk --release
```

2. **Build App Bundle (Google Play):**
```bash
flutter build appbundle --release
```

### Mobile (iOS)

1. **Build IPA:**
```bash
cd erty-mobile
flutter build ios --release
```

2. **Archive com Xcode:**
- Abrir projeto no Xcode
- Product > Archive
- Distribuir para App Store

## Configuração de Produção

### 1. Segurança

**Variáveis de ambiente críticas:**
```bash
JWT_SECRET=<gerar_chave_forte_32_caracteres>
ENCRYPTION_KEY=<gerar_chave_forte_32_caracteres>
DB_PASSWORD=<senha_forte>
```

**Gerar chaves seguras:**
```bash
openssl rand -hex 32
```

### 2. SSL/HTTPS

Obter certificados SSL (Let's Encrypt):
```bash
certbot certonly --standalone -d api.erty.app
```

Configurar Nginx para HTTPS (descomentar seção HTTPS em `nginx.conf`).

### 3. Firewall

```bash
# Permitir apenas portas necessárias
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow 22/tcp
ufw enable
```

### 4. Backup Automático

Script de backup PostgreSQL:
```bash
#!/bin/bash
# backup.sh
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups"
docker exec erty_postgres pg_dump -U postgres erty_db | gzip > $BACKUP_DIR/erty_$DATE.sql.gz
# Manter apenas últimos 7 dias
find $BACKUP_DIR -name "erty_*.sql.gz" -mtime +7 -delete
```

Adicionar ao crontab:
```bash
0 2 * * * /path/to/backup.sh
```

## Monitoramento

### 1. Logs

```bash
# Ver logs do backend
docker-compose logs -f backend

# Ver logs do PostgreSQL
docker-compose logs -f postgres

# Ver logs do Nginx
docker-compose logs -f nginx
```

### 2. Health Checks

```bash
# API Health
curl http://localhost:3000/health

# Database
docker exec erty_postgres pg_isready

# Redis
docker exec erty_redis redis-cli ping
```

### 3. Métricas

Integrar com:
- **Sentry** para error tracking
- **Google Analytics** para analytics
- **Prometheus + Grafana** para métricas

## CI/CD

O projeto inclui GitHub Actions (`.github/workflows/ci-cd.yml`):

1. **Testes automáticos** em pull requests
2. **Build de Docker image** no push para main
3. **Build de APK** para releases

### Configurar Secrets no GitHub

- `DOCKER_USERNAME`
- `DOCKER_PASSWORD`

## Escalabilidade

### Load Balancer

Adicionar múltiplas instâncias do backend:

```yaml
# docker-compose.yml
services:
  backend_1:
    ...
  backend_2:
    ...
  backend_3:
    ...
  
  nginx:
    # Configurar upstream com múltiplos backends
```

### Database Replication

Configurar PostgreSQL read replicas para queries de leitura.

### CDN

Usar CDN para assets estáticos:
- Cloudflare
- AWS CloudFront
- Google Cloud CDN

## Troubleshooting

### Backend não inicia

```bash
# Verificar logs
docker-compose logs backend

# Verificar banco de dados
docker exec -it erty_postgres psql -U postgres -d erty_db -c "SELECT 1"
```

### Erro de conexão com banco

```bash
# Verificar variáveis de ambiente
docker-compose config

# Restartar serviços
docker-compose restart postgres backend
```

### App móvel não conecta

1. Verificar `apiBaseUrl` em `app_config.dart`
2. Verificar firewall permite conexões
3. Verificar SSL/HTTPS configurado corretamente

## Manutenção

### Atualizar aplicação

```bash
git pull origin main
docker-compose down
docker-compose up -d --build
```

### Limpar dados antigos

```bash
# Limpar logs com mais de 30 dias
docker exec erty_backend find logs -name "*.log" -mtime +30 -delete
```

### Backup manual

```bash
docker exec erty_postgres pg_dump -U postgres erty_db > backup_$(date +%Y%m%d).sql
```

## Suporte

Para questões técnicas:
- Email: suporte@erty.app
- GitHub Issues: [repository]/issues
