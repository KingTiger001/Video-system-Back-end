## Déployer en staging

- Se placer à la racine du projet et build avec la commande suivante: `docker build -f config/dockerfiles/dockerfile.staging -t registry.gitlab.com/m981/saas:staging . && docker push registry.gitlab.com/m981/saas:staging`
- Se connecter au servur `ssh -i "fomo.pem" ec2-user@ec2-34-193-119-23.compute-1.amazonaws.com`
- Mettre à jour les images docker des projets modifiés (ex: `docker pull registry.gitlab.com/m981/saas:staging`)
- Enfin terminer par `docker-compose up -d`

## Déployer en production

- Se placer à la racine du projet et build avec la commande suivante: `docker build -f config/dockerfiles/dockerfile.production -t registry.gitlab.com/m981/saas:1.3.2 . && docker push registry.gitlab.com/m981/saas:1.3.2`
- Se connecter au serveur `ssh -i "fomo.pem" ec2-user@ec2-52-2-27-188.compute-1.amazonaws.com`
- Editer le fichier docker-compose.yml (`nano docker-compose.yml`)
- Mettre à jour les versions des projets modifiés et sauvegarder
- Enfin terminer par `docker-compose up -d`
