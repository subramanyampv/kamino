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
    buildType(BlogHelm_DeployStage)

    template(BlogHelm_DeployTemplate)

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
