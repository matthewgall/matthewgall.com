#!/bin/bash

echo "==================================================="
while IFS= read -r line
do
  echo "Deploying to ${line}"
  echo "==================================================="

  kubectx "$line" > /dev/null
  cat secrets.yml | envsubst | kubectl apply -n ${NAMESPACE} -f -
  cat k8s.yml | envsubst | kubectl apply -n ${NAMESPACE} -f -

  echo ""
  echo "==================================================="
done <<< $(kubectx)
