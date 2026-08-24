param([string]$AssetDirectory = "public/partner-map-logos")

$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing
Add-Type -TypeDefinition @'
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using System.Runtime.InteropServices;

public static class LogoNormalizer {
  public static string Normalize(string path) {
    string temp = path + ".normalized.png";
    string result;
    using (var source = new Bitmap(path))
    using (var bitmap = new Bitmap(source.Width, source.Height, PixelFormat.Format32bppArgb)) {
      using (var g = Graphics.FromImage(bitmap)) g.DrawImage(source, 0, 0, source.Width, source.Height);
      var rect = new Rectangle(0, 0, bitmap.Width, bitmap.Height);
      var data = bitmap.LockBits(rect, ImageLockMode.ReadWrite, PixelFormat.Format32bppArgb);
      var bytes = new byte[Math.Abs(data.Stride) * bitmap.Height];
      Marshal.Copy(data.Scan0, bytes, 0, bytes.Length);
      bool whiteEdge = IsWhite(bytes, 0) && IsWhite(bytes, (bitmap.Width - 1) * 4) && IsWhite(bytes, (bitmap.Height - 1) * data.Stride) && IsWhite(bytes, (bitmap.Height - 1) * data.Stride + (bitmap.Width - 1) * 4);
      if (whiteEdge) FloodWhiteBackground(bytes, bitmap.Width, bitmap.Height, data.Stride);
      int minX = bitmap.Width, minY = bitmap.Height, maxX = -1, maxY = -1;
      for (int y = 0; y < bitmap.Height; y++) for (int x = 0; x < bitmap.Width; x++) {
        int i = y * data.Stride + x * 4;
        if (bytes[i + 3] > 8) { if (x < minX) minX = x; if (x > maxX) maxX = x; if (y < minY) minY = y; if (y > maxY) maxY = y; }
      }
      Marshal.Copy(bytes, 0, data.Scan0, bytes.Length);
      bitmap.UnlockBits(data);
      if (maxX < minX || maxY < minY) throw new InvalidDataException("No visible logo pixels");
      int pad = Math.Max(2, (int)Math.Round(Math.Max(maxX - minX + 1, maxY - minY + 1) * 0.025));
      minX = Math.Max(0, minX - pad); minY = Math.Max(0, minY - pad); maxX = Math.Min(bitmap.Width - 1, maxX + pad); maxY = Math.Min(bitmap.Height - 1, maxY + pad);
      var crop = new Rectangle(minX, minY, maxX - minX + 1, maxY - minY + 1);
      using (var output = bitmap.Clone(crop, PixelFormat.Format32bppArgb)) {
        output.Save(temp, ImageFormat.Png);
      }
      bool fullCanvas = crop.Width == bitmap.Width && crop.Height == bitmap.Height;
      result = source.Width + "x" + source.Height + "|" + crop.Width + "x" + crop.Height + "|" + (whiteEdge ? "white-background-removed" : (fullCanvas ? "opaque-or-edge-touching-review" : "transparent-cropped"));
    }
    File.Delete(path); File.Move(temp, path);
    return result;
  }
  static bool IsWhite(byte[] bytes, int i) { return bytes[i + 3] > 245 && bytes[i] > 242 && bytes[i + 1] > 242 && bytes[i + 2] > 242; }
  static void FloodWhiteBackground(byte[] bytes, int width, int height, int stride) {
    var queue = new Queue<int>(); var seen = new bool[width * height];
    for (int x = 0; x < width; x++) { TryEnqueue(bytes, width, stride, seen, queue, x, 0); TryEnqueue(bytes, width, stride, seen, queue, x, height - 1); }
    for (int y = 1; y < height - 1; y++) { TryEnqueue(bytes, width, stride, seen, queue, 0, y); TryEnqueue(bytes, width, stride, seen, queue, width - 1, y); }
    while (queue.Count > 0) {
      int p = queue.Dequeue(), x = p % width, y = p / width, i = y * stride + x * 4;
      bytes[i + 3] = 0;
      if (x > 0) TryEnqueue(bytes, width, stride, seen, queue, x - 1, y); if (x + 1 < width) TryEnqueue(bytes, width, stride, seen, queue, x + 1, y); if (y > 0) TryEnqueue(bytes, width, stride, seen, queue, x, y - 1); if (y + 1 < height) TryEnqueue(bytes, width, stride, seen, queue, x, y + 1);
    }
  }
  static void TryEnqueue(byte[] bytes, int width, int stride, bool[] seen, Queue<int> queue, int x, int y) { int p = y * width + x; if (seen[p]) return; int i = y * stride + x * 4; if (!IsWhite(bytes, i)) return; seen[p] = true; queue.Enqueue(p); }
}
'@ -ReferencedAssemblies System.Drawing

$report = @()
Get-ChildItem -LiteralPath $AssetDirectory -Filter '*.png' | Sort-Object Name | ForEach-Object {
  try {
    $result = [LogoNormalizer]::Normalize($_.FullName).Split('|')
    $report += [pscustomobject]@{ Asset=$_.Name; Original=$result[0]; Normalized=$result[1]; Processing=$result[2]; Status=if($result[2] -eq 'opaque-or-edge-touching-review'){'REVIEW'}else{'READY'} }
  } catch {
    $report += [pscustomobject]@{ Asset=$_.Name; Original=$null; Normalized=$null; Processing=$_.Exception.Message; Status='BLOCKED' }
  }
}
Get-ChildItem -LiteralPath $AssetDirectory -Filter '*.svg' | Sort-Object Name | ForEach-Object {
  $head = Get-Content -LiteralPath $_.FullName -Raw
  $valid = $head -match '<svg[\s>]'
  $report += [pscustomobject]@{ Asset=$_.Name; Original='SVG'; Normalized='SVG'; Processing='original-vector-preserved'; Status=if($valid){'READY'}else{'BLOCKED'} }
}
$report | ConvertTo-Json -Depth 3 | Set-Content -LiteralPath (Join-Path $AssetDirectory '_normalization-report.json') -Encoding UTF8
$report | Format-Table -AutoSize
if (($report | Where-Object Status -eq 'BLOCKED').Count -gt 0) { throw 'One or more partner assets could not be normalized.' }
