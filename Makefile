export NAME?=ghost
export NAMESPACE?=matthewgall
export IMAGE?=matthewgall/matthewgall.com
export COLO:=$(shell kubectx -c)

.PHONY: apply
apply:
	@cat secrets.yml | envsubst | kubectl apply -n ${NAMESPACE} -f -
	@cat k8s.yml | envsubst | kubectl apply -n ${NAMESPACE} -f -

.PHONY: apply-multi
apply-multi:
	@.utils/deploy-all.sh

.PHONY: delete
delete:
	@cat secrets.yml | envsubst | kubectl delete -n ${NAMESPACE} -f -
	@cat k8s.yml | envsubst | kubectl delete -n ${NAMESPACE} -f -

.PHONY: deploy
deploy:
	kubectl rollout restart deployment/${NAME} -n ${NAMESPACE} && kubectl rollout status deployment/${NAME} -n ${NAMESPACE}
