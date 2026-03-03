output "cluster_name" {
  description = "Nom du cluster GKE"
  value       = module.gke.cluster_name
}

output "cluster_endpoint" {
  description = "Endpoint du cluster GKE"
  value       = module.gke.cluster_endpoint
  sensitive   = true
}

output "database_connection_name" {
  description = "Connection name de Cloud SQL"
  value       = module.cloudsql.connection_name
}

output "database_private_ip" {
  description = "IP privée de la base de données"
  value       = module.cloudsql.private_ip
}

output "kubectl_config_command" {
  description = "Commande pour configurer kubectl"
  value       = "gcloud container clusters get-credentials ${module.gke.cluster_name} --zone ${var.zone} --project ${var.project_id}"
}
