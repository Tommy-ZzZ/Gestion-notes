terraform {
  required_version = ">= 1.0"
  
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
    }
  }
}

provider "google" {
  credentials = file("~/gcp-terraform-key.json")
  project     = var.project_id
  region      = var.region
  zone        = var.zone
}

# Module Networking
module "networking" {
  source = "../../modules/networking"
  
  project_id = var.project_id
  region     = var.region
}

# Module Cloud SQL
module "cloudsql" {
  source = "../../modules/cloudsql"
  
  project_id     = var.project_id
  region         = var.region
  network_id     = module.networking.network_id
  db_name        = var.db_name
  db_user        = var.db_user
  db_password    = var.db_password
}

# Module GKE
module "gke" {
  source = "../../modules/gke"
  
  project_id     = var.project_id
  region         = var.region
  zone           = var.zone
  network_name   = module.networking.network_name
  subnetwork_name = module.networking.subnetwork_name
}
