buildImage = docker.image('node:12.7')

node {
    stage('checkout') {
        checkout scm
    }

    stage('Tests') {
        agent {
            docker {
                image 'node:12.7'
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
            "database": {
                buildImage.inside() {
                    sh 'cd modules/database && npm i'
                    sh 'cd modules/database && npm run lint'
                    sh 'cd modules/database && npm t'
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
            },
            "common": {
               buildImage.inside() {
                    sh 'cd modules/common && npm i'
                    sh 'cd modules/common && npm run lint'
                    sh 'cd modules/common && npm t'
                } 
            }
        )
    }
}
