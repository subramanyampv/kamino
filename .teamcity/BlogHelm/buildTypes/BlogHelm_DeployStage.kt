package BlogHelm.buildTypes

import jetbrains.buildServer.configs.kotlin.v2017_2.*
import jetbrains.buildServer.configs.kotlin.v2017_2.buildSteps.script

object BlogHelm_DeployStage : BuildType({
    uuid = "2c559e38-b9b4-4dcf-a79f-2faa91c9f5af"
    id = "BlogHelm_DeployStage"
    name = "Deploy Stage"

    params {
        select("env", "", label = "Environment", description = "Select the environment to deploy to", display = ParameterDisplay.PROMPT,
                options = listOf("Test" to "test", "Acceptance" to "acc", "Production" to "prod"))
        param("helm.host", "192.168.99.101:30200")
    }

    steps {
        script {
            scriptContent = """
                IMAGE_TAG=${'$'}(cat image-tag.txt)
                echo "Using version ${'$'}IMAGE_TAG"
                
                helm upgrade --install blog-helm-%env% \
                  ./blog-helm-${'$'}{IMAGE_TAG}.tgz \
                  --set image.tag=${'$'}IMAGE_TAG \
                  --values ./values-%env%.yaml \
                  --debug \
                  --wait
            """.trimIndent()
            dockerImage = "lachlanevenson/k8s-helm:v2.6.2"
            dockerRunParameters = "--rm -e HELM_HOST=%helm.host%"
        }
    }

    dependencies {
        artifacts(BlogHelm.buildTypes.BlogHelm_CommitStage) {
            buildRule = lastSuccessful()
            cleanDestination = true
            artifactRules = """
                *.tgz
                *.txt
                values-*.yaml
            """.trimIndent()
        }
    }
})
