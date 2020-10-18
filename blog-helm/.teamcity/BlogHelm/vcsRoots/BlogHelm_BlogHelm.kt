package BlogHelm.vcsRoots

import jetbrains.buildServer.configs.kotlin.v2018_2.*
import jetbrains.buildServer.configs.kotlin.v2018_2.vcs.GitVcsRoot

object BlogHelm_BlogHelm : GitVcsRoot({
    uuid = "afe75756-1547-486a-8923-58976e646819"
    id("BlogHelm_BlogHelm")
    name = "blog-helm"
    url = "git@github.com:ngeor/blog-helm.git"
    branchSpec = "+:refs/heads/*"
    useMirrors = false
    authMethod = uploadedKey {
        uploadedKey = "ENVY"
    }
})
