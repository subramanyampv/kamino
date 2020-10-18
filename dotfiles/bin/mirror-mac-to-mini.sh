#!/bin/bash
set -e
echo "Mini no longer accepts backups!"
exit 1

HOST=192.168.2.1
ZFS_DATASET=tank/mirror/mac
# take snapshot
ssh $HOST /home/ngeor/bin/zfs-snapshot.sh $ZFS_DATASET
DEST=/$ZFS_DATASET/
SRC=/Users/ngeor/

# -a: archive
# -v: verbose
# -z: compress during transfer
rsync -e ssh --progress --delete-excluded --delete \
  --exclude *.log \
  --exclude *.swp \
  --exclude .DS_Store \
  --exclude .Trash/ \
  --exclude .android/ \
  --exclude .aspnet/ \
  --exclude .bash_history \
  --exclude .bash_sessions/ \
  --exclude .cache/ \
  --exclude .docker/ \
  --exclude .ivy2/ \
  --exclude .local/share/JetBrains/ \
  --exclude .m2/repository/ \
  --exclude .minikube/ \
  --exclude .mono/ \
  --exclude .npm/ \
  --exclude .nuget/ \
  --exclude .omnisharp/ \
  --exclude .oracle_jre_usage/ \
  --exclude .sbt/ \
  --exclude .subversion/ \
  --exclude .v8flags* \
  --exclude .viminfo \
  --exclude .vscode/ \
  --exclude Cache/ \
  --exclude CachedData/ \
  --exclude Caches/ \
  --exclude cache/ \
  --exclude library-cache/ \
  --exclude v3-cache/ \
  --exclude Chrome/ \
  --exclude Xamarin/ \
  --exclude Library/Application\ Support/Google/ \
  --exclude Library/Application\ Support/Microsoft/ \
  --exclude Library/Application\ Support/Skype/ \
  --exclude Library/Containers/ \
  --exclude Library/Developer/ \
  --exclude Library/Google/ \
  --exclude Library/Group\ Containers/ \
  --exclude Library/LanguageModeling/ \
  --exclude Library/Preferences/ \
  --exclude Library/Saved\ Application\ State/ \
  -avz $SRC $HOST:$DEST
