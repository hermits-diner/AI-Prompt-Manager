# 한글 커밋 메시지가 GitHub에서 깨지지 않도록 UTF-8로 커밋
# 사용: .\scripts\commit-ko.ps1 -m "커밋 메시지"
# 또는: .\scripts\commit-ko.ps1 "커밋 메시지"

param(
  [Parameter(Mandatory = $true, Position = 0)]
  [string]$Message
)

$OutputEncoding = [Console]::OutputEncoding = [Text.Encoding]::UTF8
chcp 65001 | Out-Null
git commit -m $Message
