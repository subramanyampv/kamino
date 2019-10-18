package BlogHelm

import BlogHelm.buildTypes.*
import BlogHelm.vcsRoots.*
import BlogHelm.vcsRoots.BlogHelm_BlogHelm
import jetbrains.buildServer.configs.kotlin.v2018_2.*
import jetbrains.buildServer.configs.kotlin.v2018_2.Project
import jetbrains.buildServer.configs.kotlin.v2018_2.projectFeatures.VersionedSettings
import jetbrains.buildServer.configs.kotlin.v2018_2.projectFeatures.versionedSettings

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
    buildTypesOrderIds = arrayListOf(AbsoluteId("BlogHelm_CommitStage"), AbsoluteId("BlogHelm_SmokeTest"), AbsoluteId("BlogHelm_DeployTest"), AbsoluteId("BlogHelm_DeployAcceptance"), AbsoluteId("BlogHelm_DeployProduction"))

    template(BlogHelm_DeployTemplate)

    params {
        param("docker.registry", "")
        param("docker.server", "")
        param("docker.username", "")
        param("lachlanevenson.k8s-helm.tag", "v2.8.2")
        param("app.name", "blog-helm")
        param("ci.image", "node:8-jessie") // node:8-slim cannot install phantomjs
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
