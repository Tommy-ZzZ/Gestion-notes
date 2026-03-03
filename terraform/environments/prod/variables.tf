variable "project_id" {
  description = "ID du projet GCP"
  type        = string
  default     = "gestion-notes-prod"
}

variable "region" {
  description = "Région GCP"
  type        = string
  default     = "europe-west1"
}

variable "zone" {
  description = "Zone GCP"
  type        = string
  default     = "europe-west1-b"
}

variable "db_name" {
  description = "Nom de la base de données"
  type        = string
  default     = "notes_db"
}

variable "db_user" {
  description = "Utilisateur de la base de données"
  type        = string
  default     = "notes_user"
}

variable "db_password" {
  description = "Mot de passe de la base de données"
  type        = string
  sensitive   = true
  default     = "ChangeThisSecurePassword123!"
}

variable "recaptcha_secret_key" {
  description = "Clé secrète reCAPTCHA"
  type        = string
  sensitive   = true
  default     = "6Ld62hYsAAAAAJVqg2PMzMdKLb-Z4ufmQ_K0cfBo"
}
