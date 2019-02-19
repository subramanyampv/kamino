# Aliases for PowerShell

function ll {
    dir -Attributes ReadOnly,Hidden,System,Directory,Archive
}

function gs {
    git status
}

function sortpom {
    mvn com.github.ekryd.sortpom:sortpom-maven-plugin:sort
}

function syncpom {
    mvn yak4j-sync-archetype:sync@sync
}
