buildImage = docker.image('node:16.14')

node {
    stage('checkout') {
        checkout scm
    }

    stage('Tests') {
        agent {
            docker {
                image 'node:16.14'
            }
        }

        parallel(
            "aws": {
                buildImage.inside() {
                    sh 'cd modules/aws && npm i'
                    sh 'cd modules/aws && npm run lint'
                    sh 'cd modules/aws && npm t'
                }
            },
             "common": {
               buildImage.inside() {
                    sh 'cd modules/common && npm i'
                    sh 'cd modules/common && npm run lint'
                    sh 'cd modules/common && npm t'
                } 
            },
            "google-pubsub": {
                buildImage.inside() {
                    sh 'cd modules/google-pubsub && npm i'
                    sh 'cd modules/google-pubsub && npm run lint'
                    sh 'cd modules/google-pubsub && npm t'
                }
            },
            "salesforce": {
                buildImage.inside() {
                    sh 'cd modules/salesforce && npm i'
                    sh 'cd modules/salesforce && npm run lint'
                    sh 'cd modules/salesforce && npm t'
                }
            }
        )
    }
}
