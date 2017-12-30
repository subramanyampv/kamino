package BlogHelm

import BlogHelm.buildTypes.*
import BlogHelm.vcsRoots.*
import BlogHelm.vcsRoots.BlogHelm_BlogHelm
import jetbrains.buildServer.configs.kotlin.v2017_2.*
import jetbrains.buildServer.configs.kotlin.v2017_2.Project
import jetbrains.buildServer.configs.kotlin.v2017_2.projectFeatures.VersionedSettings
import jetbrains.buildServer.configs.kotlin.v2017_2.projectFeatures.versionedSettings

object Project : Project({
    uuid = "d3c230cf-b4cd-4a9e-8017-4b4b945b3a3c"
    id = "BlogHelm"
    parentId = "_Root"
    name = "Blog Helm"

    vcsRoot(BlogHelm_BlogHelm)

    buildType(BlogHelm_CommitStage)
    buildType(BlogHelm_SmokeTest)
    buildType(BlogHelm_DeployTest)
    buildType(BlogHelm_DeployAcceptance)
    buildType(BlogHelm_DeployProduction)
    buildTypesOrderIds = arrayListOf("BlogHelm_CommitStage", "BlogHelm_SmokeTest", "BlogHelm_DeployTest", "BlogHelm_DeployAcceptance", "BlogHelm_DeployProduction")

    template(BlogHelm_DeployTemplate)

    params {
        param("docker.registry", "830988624223.dkr.ecr.eu-west-1.amazonaws.com")
        param("docker.server", "https://%docker.registry%")
        param("docker.username", "AWS")
        password("docker.password", "credentialsJSON:175b2d15-2353-475e-ab70-571d1e5843e9", label = "Docker registry password")
        param("lachlanevenson.k8s-helm.tag", "v2.6.2")
    }

    features {
        versionedSettings {
            id = "PROJECT_EXT_3"
            mode = VersionedSettings.Mode.ENABLED
            buildSettingsMode = VersionedSettings.BuildSettingsMode.PREFER_SETTINGS_FROM_VCS
            rootExtId = BlogHelm_BlogHelm.id
            showChanges = false
            settingsFormat = VersionedSettings.Format.KOTLIN
            storeSecureParamsOutsideOfVcs = true
        }
    }
})
