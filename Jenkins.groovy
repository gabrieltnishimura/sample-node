env.DOCKER_TAG="master"
env.DOCKER_IMAGE="pcorbr"
env.DOCKER_NAME="${env.DOCKER_IMAGE}:${env.DOCKER_TAG}"

node('docker') {
    wrap([$class: 'AnsiColorBuildWrapper', 'colorMapName': 'XTerm']) {
        try {
        	stage('Preparation') {
        		checkout([$class: 'GitSCM', branches: [[name: "*/master"]], doGenerateSubmoduleConfigurations: false, extensions: [], submoduleCfg: [], userRemoteConfigs: [[url: "https://github.com/gabrieltnishimura/sample-node.git"]]])
        	}
        	stage('Build') {
                sh """docker build -t ${DOCKER_NAME} \
                    --no-cache \
                    --build-arg BROWSERSTACK_USERNAME=${BROWSERSTACK_USERNAME} \
                    --build-arg BROWSERSTACK_ACCESS_KEY=${BROWSERSTACK_ACCESS_KEY} .
                """		
                sh "docker rm -f $DOCKER_IMAGE || echo 'Container not created'"
                sh 'docker run -i --name $DOCKER_IMAGE $DOCKER_NAME test'
                    
        		copyArtifactsFromDocker()
        	}
        	stage('Results') {
        		archive '*.tgz'
        	}
        } catch (e) {
            throw e
        }
    }
}

def copyArtifactsFromDocker(){
	sh 'docker cp $DOCKER_IMAGE:/opt/app/library.tgz library.tgz || echo WARNING: library built not builded'
}