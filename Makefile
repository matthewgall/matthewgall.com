export NAME?=ghost
export NAMESPACE?=matthewgall
export IMAGE?=matthewgall/matthewgall.com
export COLO:=$(shell kubectx -c)

.PHONY: apply apply-all
apply:
	@.utils/apply ${COLO}
apply-all:
	@.utils/apply all

.PHONY: delete delete-all
delete:
	@.utils/delete ${COLO}
apply-all:
	@.utils/delete all

.PHONY: rollout rollout-all
rollout:
	@.utils/rollout ${COLO}
rollout-all:
	@.utils/rollout all