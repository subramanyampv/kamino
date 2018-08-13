package BlogHelm

import BlogHelm.buildTypes.*
import BlogHelm.vcsRoots.*
import BlogHelm.vcsRoots.BlogHelm_BlogHelm
import jetbrains.buildServer.configs.kotlin.v2018_1.*
import jetbrains.buildServer.configs.kotlin.v2018_1.Project
import jetbrains.buildServer.configs.kotlin.v2018_1.projectFeatures.VersionedSettings
import jetbrains.buildServer.configs.kotlin.v2018_1.projectFeatures.versionedSettings

object Project : Project({
    uuid = "d3c230cf-b4cd-4a9e-8017-4b4b945b3a3c"
    id("BlogHelm")
    parentId("_Root")
    name = "Blog Helm"

    vcsRoot(BlogHelm_BlogHelm)

    buildType(BlogHelm_CommitStage)
    buildType(BlogHelm_SmokeTest)
    buildType(BlogHelm_DeployTest)
    buildType(BlogHelm_DeployAcceptance)
    buildType(BlogHelm_DeployProduction)

    template(BlogHelm_DeployTemplate)

    params {
        param("docker.registry", "")
        param("docker.server", "")
        param("docker.username", "")
        param("lachlanevenson.k8s-helm.tag", "v2.6.2")
    }

    features {
        versionedSettings {
            mode = VersionedSettings.Mode.ENABLED
            buildSettingsMode = VersionedSettings.BuildSettingsMode.PREFER_SETTINGS_FROM_VCS
            rootExtId = "BlogHelm_BlogHelm"
            showChanges = false
            settingsFormat = VersionedSettings.Format.KOTLIN
            storeSecureParamsOutsideOfVcs = true
        }
        feature {
            type = "IssueTracker"
            param("secure:password", "")
            param("name", "ngeor/blog-helm")
            param("pattern", """#(\d+)""")
            param("authType", "anonymous")
            param("repository", "https://github.com/ngeor/blog-helm")
            param("type", "GithubIssues")
            param("secure:accessToken", "")
            param("username", "")
        }
    }
})
