package BlogHelm.buildTypes

import jetbrains.buildServer.configs.kotlin.v2017_2.*
import jetbrains.buildServer.configs.kotlin.v2017_2.buildSteps.script

object BlogHelm_DeployStage : BuildType({
    uuid = "2c559e38-b9b4-4dcf-a79f-2faa91c9f5af"
    id = "BlogHelm_DeployStage"
    name = "Deploy Stage"

    enablePersonalBuilds = false
    type = BuildTypeSettings.Type.DEPLOYMENT
    maxRunningBuilds = 1

    params {
        text("env", "", label = "Environment", description = "Select the environment to deploy to",
              regex = "^test|acc|prod${'$'}", validationMessage = "Must be one of test acc prod")
        param("helm.host", "192.168.99.101:30200")
    }

    vcs {
        root(BlogHelm.vcsRoots.BlogHelm_BlogHelm)

        showDependenciesChanges = true
    }

    steps {
        script {
            scriptContent = """
                IMAGE_TAG=${'$'}(cat artifacts/image-tag.txt)
                echo "Using version ${'$'}IMAGE_TAG"

                helm upgrade --install blog-helm-%env% \
                  ./artifacts/blog-helm-${'$'}{IMAGE_TAG}.tgz \
                  --set image.tag=${'$'}IMAGE_TAG \
                  --values ./artifacts/values-%env%.yaml \
                  --debug \
                  --wait
            """.trimIndent()
            dockerImage = "lachlanevenson/k8s-helm:v2.6.2"
            dockerRunParameters = "--rm -e HELM_HOST=%helm.host%"
        }
    }

    dependencies {
        dependency(BlogHelm.buildTypes.BlogHelm_CommitStage) {
            snapshot {
                onDependencyFailure = FailureAction.FAIL_TO_START
            }

            artifacts {
                cleanDestination = true
                artifactRules = """
                    *.tgz => artifacts
                    *.txt => artifacts
                    values-*.yaml => artifacts
                """.trimIndent()
            }
        }
    }
})
