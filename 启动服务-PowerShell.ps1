# 课游工坊 — PowerShell 静态文件服务器
# 当系统未安装 Python 时，由 启动课游工坊.bat 自动调用此脚本

$port = 5173
$distPath = Join-Path $PSScriptRoot "dist"

if (-not (Test-Path $distPath)) {
    Write-Host "[错误] 未找到 dist 目录" -ForegroundColor Red
    Read-Host "按回车键退出"
    exit 1
}

try {
    $listener = New-Object System.Net.HttpListener
    $listener.Prefixes.Add("http://localhost:$port/")
    $listener.Start()
} catch {
    Write-Host "[错误] 无法启动服务：$($_.Exception.Message)" -ForegroundColor Red
    Write-Host "可能是端口 $port 被占用，请关闭其他程序后重试。" -ForegroundColor Yellow
    Read-Host "按回车键退出"
    exit 1
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  课游工坊 — 服务已启动" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "浏览器应已自动打开，请勿关闭此窗口。" -ForegroundColor Green
Write-Host "关闭此窗口即可停止服务。" -ForegroundColor Green
Write-Host ""

# 打开浏览器
Start-Process "http://localhost:$port"

# MIME 类型映射
$mimeTypes = @{
    '.html' = 'text/html; charset=utf-8'
    '.js'   = 'application/javascript; charset=utf-8'
    '.css'  = 'text/css; charset=utf-8'
    '.json' = 'application/json; charset=utf-8'
    '.svg'  = 'image/svg+xml'
    '.png'  = 'image/png'
    '.jpg'  = 'image/jpeg'
    '.ico'  = 'image/x-icon'
    '.woff' = 'font/woff'
    '.woff2' = 'font/woff2'
    '.woff' = 'font/woff'
}

# 提供静态文件服务
while ($listener.IsListening) {
    try {
        $context = $listener.GetContext()
        $requestPath = $context.Request.Url.LocalPath

        if ($requestPath -eq '/' -or $requestPath -eq '') {
            $requestPath = '/index.html'
        }

        # URL 解码
        $requestPath = [System.Uri]::UnescapeDataString($requestPath)
        $filePath = Join-Path $distPath $requestPath.TrimStart('/')

        if (Test-Path $filePath -PathType Leaf) {
            $extension = [System.IO.Path]::GetExtension($filePath).ToLower()
            $contentType = $mimeTypes[$extension]
            if (-not $contentType) {
                $contentType = 'application/octet-stream'
            }

            $bytes = [System.IO.File]::ReadAllBytes($filePath)
            $context.Response.ContentType = $contentType
            $context.Response.ContentLength64 = $bytes.Length
            $context.Response.OutputStream.Write($bytes, 0, $bytes.Length)
        } else {
            $context.Response.StatusCode = 404
            $notFound = [System.Text.Encoding]::UTF8.GetBytes('404 - File not found')
            $context.Response.OutputStream.Write($notFound, 0, $notFound.Length)
        }
    } catch {
        # 忽略单个请求的异常，继续服务
    } finally {
        if ($context) {
            $context.Response.Close()
        }
    }
}

$listener.Stop()
