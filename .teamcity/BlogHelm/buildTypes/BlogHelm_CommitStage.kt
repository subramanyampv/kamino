package BlogHelm.buildTypes

import BlogHelm.vcsRoots.BlogHelm_BlogHelm
import jetbrains.buildServer.configs.kotlin.v2017_2.*
import jetbrains.buildServer.configs.kotlin.v2017_2.buildFeatures.sshAgent
import jetbrains.buildServer.configs.kotlin.v2017_2.buildFeatures.vcsLabeling
import jetbrains.buildServer.configs.kotlin.v2017_2.buildSteps.dockerBuild
import jetbrains.buildServer.configs.kotlin.v2017_2.buildSteps.exec
import jetbrains.buildServer.configs.kotlin.v2017_2.buildSteps.script
import jetbrains.buildServer.configs.kotlin.v2017_2.triggers.vcs

object BlogHelm_CommitStage : BuildType({
    uuid = "3f8adc5d-5b14-4a13-9ecd-70b624f828de"
    id = "BlogHelm_CommitStage"
    name = "Commit Stage"
    enablePersonalBuilds = false
    artifactRules = """
        blog-helm-%env.IMAGE_TAG%.tgz
        helm/blog-helm/values-*.yaml
    """.trimIndent()
    maxRunningBuilds = 1

    params {
        param("env.IMAGE_TAG", "")
    }

    vcs {
        root(BlogHelm.vcsRoots.BlogHelm_BlogHelm)
        showDependenciesChanges = true
    }

    steps {
        script {
            name = "Basic diagnostics"
            scriptContent = """
                lsb_release -cdir
                docker version
            """.trimIndent()
        }
        exec {
            name = "Ensure feature branch is ahead of master"
            path = "ci-scripts/merge.sh"
        }
        exec {
            name = "Determine version"
            path = "ci-scripts/version.sh"
        }
        dockerBuild {
            name = "Build CI Image"
            source = path {
                path = "Dockerfile-ci"
            }
            namesAndTags = """
                blog-helm-ci:%env.IMAGE_TAG%
                %docker.registry%/blog-helm-ci:%env.IMAGE_TAG%
            """.trimIndent()
        }
        script {
            name = "Run linting"
            scriptContent = """
                docker run \
                  --rm -v ${'$'}(pwd)/test-reports:/app/test-reports \
                  blog-helm-ci:%env.IMAGE_TAG% \
                  npm run lint-junit

                docker run \
                  --rm -v ${'$'}(pwd)/test-reports:/app/test-reports \
                  blog-helm-ci:%env.IMAGE_TAG% \
                  chown -R ${'$'}(id -u):${'$'}(id -g) test-reports
            """.trimIndent()
        }
        dockerBuild {
            name = "Build production Docker image"
            source = path {
                path = "Dockerfile"
            }
            namesAndTags = """
                blog-helm:%env.IMAGE_TAG%
                %docker.registry%/blog-helm:%env.IMAGE_TAG%
            """.trimIndent()
        }
        script {
            name = "Package Helm Chart"
            scriptContent = """
                helm init --client-only
                helm package --debug \
                  --version %env.IMAGE_TAG% \
                  ./helm/blog-helm
            """.trimIndent()
            dockerImage = "lachlanevenson/k8s-helm:%lachlanevenson.k8s-helm.tag%"
        }
        script {
            name = "Push Docker production image"
            scriptContent = "docker push %docker.registry%/blog-helm:%env.IMAGE_TAG%"
        }
        script {
            name = "Push Docker CI image"
            scriptContent = "docker push %docker.registry%/blog-helm-ci:%env.IMAGE_TAG%"
        }
    }

    triggers {
        vcs {
        }
    }

    features {
        feature {
            type = "perfmon"
        }
        feature {
            type = "xml-report-plugin"
            param("xmlReportParsing.reportType", "junit")
            param("xmlReportParsing.reportDirs", "test-reports/eslint.xml")
            param("xmlReportParsing.verboseOutput", "true")
        }
        vcsLabeling {
            vcsRootExtId = BlogHelm_BlogHelm.id
            labelingPattern = "v%system.build.number%"
            successfulOnly = true
        }
        sshAgent {
            teamcitySshKey = "ENVY"
        }
    }
})
