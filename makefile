deliver_image_to_dockerhub: build cleanup push
TAG	   := $$(curl --silent -H  "Authorization: token ${GH_TOKEN}" "https://api.github.com/repos/${organization}/${repository}/releases" | grep tag_name | head -1 |grep -oP  '(?<=\").*?(?=\")' | cut -d " " -f2 | tail -1 | sed 's/\@/\-/')
IMG    := ${REGISTRY}/${REPO}/frontend:${TAG}

retrivetag:
	@echo -n frontend:${TAG}
build:
	@docker build --no-cache -t ${IMG} .
	
cleanup:
	@docker system prune -f
  
push:
	@docker push ${IMG}
