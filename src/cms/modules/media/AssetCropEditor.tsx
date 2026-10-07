/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect, useRef, useCallback, useTransition } from 'react';
import {
  Crop,
  RotateCw,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Crosshair,
  Sparkles,
  Check,
  Trash2,
  Copy,
  ExternalLink,
  Scissors,
  RefreshCw,
  Sliders,
  Layers,
  Info,
} from 'lucide-react';
import type { MediaAsset, AssetVariant } from './types';
import { createCropVariantAction, saveMediaFocalPointAction, deleteMediaVariantAction } from '@/features/media/server/actions';
import { CmsDeleteConfirmModal } from '@/shared/ui/cms';

interface AssetCropEditorProps {
  asset: MediaAsset;
  locale: 'vi' | 'en';
  canEdit: boolean;
  onRefreshAsset: () => void;
  onShowToast?: (msg: string) => void;
}

type AspectRatioPreset = '16:9' | '4:3' | '1:1' | '3:2' | 'custom';

const ASPECT_RATIOS: { id: AspectRatioPreset; label: string; ratio: number | null; desc: string }[] = [
  { id: '16:9', label: '16:9', ratio: 16 / 9, desc: 'Banner / Header' },
  { id: '4:3', label: '4:3', ratio: 4 / 3, desc: 'Bài viết / Card' },
  { id: '1:1', label: '1:1', ratio: 1, desc: 'Vuông / Thumbnail' },
  { id: '3:2', label: '3:2', ratio: 3 / 2, desc: 'Nhiếp ảnh' },
  { id: 'custom', label: 'Tự do', ratio: null, desc: 'Tùy chỉnh' },
];

export const AssetCropEditor: React.FC<AssetCropEditorProps> = ({
  asset,
  locale,
  canEdit,
  onRefreshAsset,
  onShowToast,
}) => {
  const [isPending, startTransition] = useTransition();
  const [selectedPreset, setSelectedPreset] = useState<AspectRatioPreset>('16:9');
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);

  // Focal point state (0 to 100%)
  const [focalPoint, setFocalPoint] = useState<{ x: number; y: number }>(() => {
    if (asset.focal_point) return asset.focal_point;
    if (asset.variants?.length && asset.variants[0].focal_point) return asset.variants[0].focal_point;
    return { x: 50, y: 50 };
  });
  const [isSavingFocal, setIsSavingFocal] = useState(false);

  // Crop box state in percentages (0 to 100%)
  const [cropBox, setCropBox] = useState<{ x: number; y: number; width: number; height: number }>({
    x: 5,
    y: 5,
    width: 90,
    height: 50.625, // 90 * (9/16)
  });

  const [naturalSize, setNaturalSize] = useState<{ width: number; height: number }>({
    width: asset.width || 1200,
    height: asset.height || 800,
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ mouseX: 0, mouseY: 0, boxX: 0, boxY: 0 });

  // Update focal point if asset changes
  useEffect(() => {
    if (asset.focal_point) {
      setFocalPoint(asset.focal_point);
    } else if (asset.variants?.length && asset.variants[0].focal_point) {
      setFocalPoint(asset.variants[0].focal_point);
    }
  }, [asset.id, asset.focal_point, asset.variants]);

  // Adjust crop box when aspect ratio preset changes
  useEffect(() => {
    const presetObj = ASPECT_RATIOS.find((p) => p.id === selectedPreset);
    if (!presetObj || presetObj.ratio === null) return;

    const targetRatio = presetObj.ratio;
    const imgRatio = (naturalSize.width || 1) / (naturalSize.height || 1);

    let newWidth = 90;
    let newHeight = 90;

    if (imgRatio >= targetRatio) {
      // Image is wider than target ratio
      newHeight = 90;
      newWidth = Math.min(95, Math.round(newHeight * (targetRatio / imgRatio)));
    } else {
      // Image is taller than target ratio
      newWidth = 90;
      newHeight = Math.min(95, Math.round(newWidth * (imgRatio / targetRatio)));
    }

    const newX = Math.max(0, Math.round((100 - newWidth) / 2));
    const newY = Math.max(0, Math.round((100 - newHeight) / 2));

    setCropBox({ x: newX, y: newY, width: newWidth, height: newHeight });
  }, [selectedPreset, naturalSize]);

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    setNaturalSize({ width: img.naturalWidth, height: img.naturalHeight });
  };

  const handleReset = () => {
    setZoom(1);
    setRotation(0);
    setSelectedPreset('16:9');
    setCropBox({ x: 5, y: 15, width: 90, height: 50.625 });
    onShowToast?.('Đã đặt lại trạng thái crop.');
  };

  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, Math.round(((e.clientX - rect.left) / rect.width) * 100)));
    const y = Math.max(0, Math.min(100, Math.round(((e.clientY - rect.top) / rect.height) * 100)));
    setFocalPoint({ x, y });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    isDraggingRef.current = true;
    dragStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      boxX: cropBox.x,
      boxY: cropBox.y,
    };
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDraggingRef.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const deltaXPercent = ((e.clientX - dragStartRef.current.mouseX) / rect.width) * 100;
      const deltaYPercent = ((e.clientY - dragStartRef.current.mouseY) / rect.height) * 100;

      const newX = Math.max(0, Math.min(100 - cropBox.width, dragStartRef.current.boxX + deltaXPercent));
      const newY = Math.max(0, Math.min(100 - cropBox.height, dragStartRef.current.boxY + deltaYPercent));

      setCropBox((prev) => ({ ...prev, x: Math.round(newX), y: Math.round(newY) }));
    },
    [cropBox.width, cropBox.height]
  );

  const handleMouseUp = useCallback(() => {
    isDraggingRef.current = false;
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  // Save Focal Point
  const handleSaveFocalPoint = () => {
    if (!canEdit) return;
    setIsSavingFocal(true);
    startTransition(async () => {
      try {
        await saveMediaFocalPointAction({
          assetId: Number(asset.id),
          locale,
          focalX: focalPoint.x,
          focalY: focalPoint.y,
        });
        onShowToast?.(`Đã lưu điểm hội tụ (X: ${focalPoint.x}%, Y: ${focalPoint.y}%)`);
        onRefreshAsset();
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Không thể lưu tiêu điểm.';
        onShowToast?.(`Lỗi: ${msg}`);
      } finally {
        setIsSavingFocal(false);
      }
    });
  };

  // Perform Crop & Create Variant with Sharp
  const handleCreateCropVariant = () => {
    if (!canEdit) return;

    // Calculate actual pixel coordinates relative to original natural resolution
    const actualX = Math.round((cropBox.x / 100) * naturalSize.width);
    const actualY = Math.round((cropBox.y / 100) * naturalSize.height);
    const actualW = Math.round((cropBox.width / 100) * naturalSize.width);
    const actualH = Math.round((cropBox.height / 100) * naturalSize.height);

    startTransition(async () => {
      try {
        const result = await createCropVariantAction({
          assetId: Number(asset.id),
          locale,
          presetName: selectedPreset,
          crop: {
            x: actualX,
            y: actualY,
            width: actualW,
            height: actualH,
          },
          rotate: rotation,
          focalX: focalPoint.x,
          focalY: focalPoint.y,
        });

        onShowToast?.(`Đã tạo thành công biến thể ${selectedPreset} (${result.width}x${result.height} px)!`);
        onRefreshAsset();
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Cắt ảnh thất bại.';
        onShowToast?.(`Lỗi crop: ${msg}`);
      }
    });
  };

  // Delete variant
  const [deleteVariantTarget, setDeleteVariantTarget] = useState<{ id: string; presetName: string } | null>(null);

  const handleDeleteVariant = (variantId: string, presetName: string) => {
    if (!canEdit) return;
    setDeleteVariantTarget({ id: variantId, presetName });
  };

  const confirmDeleteVariant = () => {
    if (!deleteVariantTarget) return;
    const { id, presetName } = deleteVariantTarget;

    startTransition(async () => {
      try {
        await deleteMediaVariantAction(Number(id));
        onShowToast?.(`Đã xóa biến thể "${presetName}".`);
        setDeleteVariantTarget(null);
        onRefreshAsset();
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Xóa biến thể thất bại.';
        onShowToast?.(`Lỗi: ${msg}`);
      }
    });
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    onShowToast?.('Đã sao chép liên kết biến thể vào clipboard.');
  };

  // Calculate estimated crop resolution for UI preview
  const estimatedWidth = Math.round((cropBox.width / 100) * naturalSize.width);
  const estimatedHeight = Math.round((cropBox.height / 100) * naturalSize.height);

  if (asset.type !== 'image') {
    return (
      <div className="p-8 text-center rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 text-xs text-slate-500 space-y-2">
        <p className="font-bold text-slate-700 dark:text-slate-300">Tính năng Cắt ảnh & Biến thể chỉ áp dụng cho tệp hình ảnh.</p>
        <p className="text-slate-400">Tệp này có định dạng: {asset.mime_type}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 0. NOTICE FOR ICO FORMAT */}
      {(asset.filename.toLowerCase().endsWith('.ico') || asset.mime_type.includes('icon')) && (
        <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs text-amber-700 dark:text-amber-300 flex items-center gap-2">
          <Info className="w-4 h-4 shrink-0 text-amber-500" />
          <span>Tệp biểu tượng Icon (.ico): Engine sẽ tự động trích xuất ảnh nét nhất bên trong để cắt và xuất sang WebP chuẩn.</span>
        </div>
      )}

      {/* 1. TOP TOOLBAR: PRESETS & TRANSFORM CONTROLS */}
      <div className="p-4 bg-slate-50 dark:bg-slate-850 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Scissors className="w-4 h-4 text-orange-500" /> Tỉ lệ khung hình (Aspect Ratio)
            </span>
            <p className="text-[11px] text-slate-500">Chọn tỉ lệ chuẩn để tối ưu hiển thị trên các giao diện khác nhau.</p>
          </div>

          {/* Reset button */}
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Đặt lại
          </button>
        </div>

        {/* Ratio Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {ASPECT_RATIOS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setSelectedPreset(item.id)}
              className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all ${
                selectedPreset === item.id
                  ? 'bg-orange-500/10 border-orange-500 text-orange-600 dark:text-orange-400 font-bold shadow-xs'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
              }`}
            >
              <span className="text-xs font-bold">{item.label}</span>
              <span className="text-[10px] text-slate-400 font-normal">{item.desc}</span>
            </button>
          ))}
        </div>

        {/* Sliders: Zoom & Rotate */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-slate-200 dark:border-slate-800">
          {/* Zoom Slider */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <ZoomIn className="w-3.5 h-3.5 text-slate-400" /> Thu phóng (Zoom): {zoom.toFixed(1)}x
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setZoom((z) => Math.max(1, +(z - 0.1).toFixed(1)))}
                  className="p-1 rounded bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 text-slate-700 dark:text-slate-300"
                  title="Thu nhỏ"
                >
                  <ZoomOut className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  onClick={() => setZoom((z) => Math.min(3, +(z + 0.1).toFixed(1)))}
                  className="p-1 rounded bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 text-slate-700 dark:text-slate-300"
                  title="Phóng to"
                >
                  <ZoomIn className="w-3 h-3" />
                </button>
              </div>
            </div>
            <input
              type="range"
              min="1"
              max="3"
              step="0.05"
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              className="w-full accent-orange-600"
            />
          </div>

          {/* Rotate Slider & Quick Rotate */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <RotateCw className="w-3.5 h-3.5 text-slate-400" /> Xoay ảnh (Rotate): {rotation}°
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setRotation((r) => ((r - 90) % 360))}
                  className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 text-[10px] font-mono"
                  title="Xoay ngược chiều kim đồng hồ 90 độ"
                >
                  <RotateCcw className="w-3 h-3 inline mr-0.5" /> -90°
                </button>
                <button
                  type="button"
                  onClick={() => setRotation((r) => ((r + 90) % 360))}
                  className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 text-[10px] font-mono"
                  title="Xoay theo chiều kim đồng hồ 90 độ"
                >
                  <RotateCw className="w-3 h-3 inline mr-0.5" /> +90°
                </button>
              </div>
            </div>
            <input
              type="range"
              min="-180"
              max="180"
              step="5"
              value={rotation}
              onChange={(e) => setRotation(parseInt(e.target.value, 10))}
              className="w-full accent-orange-600"
            />
          </div>
        </div>
      </div>

      {/* 2. MAIN INTERACTIVE CROP CANVAS & PREVIEW */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive Canvas Box */}
        <div className="lg:col-span-8 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200">
              <Crosshair className="w-4 h-4 text-orange-500" /> Vùng cắt & Tiêu điểm
            </span>
            <span>Kéo khung cam để định vị vùng cắt, bấm ảnh để đặt Focal Point</span>
          </div>

          <div
            ref={containerRef}
            onClick={handleContainerClick}
            className="relative aspect-16/10 bg-slate-950 rounded-2xl overflow-hidden cursor-crosshair shadow-inner select-none flex items-center justify-center border border-slate-700"
          >
            {/* The Image */}
            <img
              src={asset.url}
              alt={asset.title}
              onLoad={handleImageLoad}
              style={{
                transform: `scale(${zoom}) rotate(${rotation}deg)`,
                transition: isDraggingRef.current ? 'none' : 'transform 0.15s ease-out',
              }}
              className="w-full h-full object-contain pointer-events-none"
            />

            {/* Dark Shaded Overlay */}
            <div className="absolute inset-0 bg-black/40 pointer-events-none" />

            {/* Draggable Active Crop Box Window */}
            <div
              onMouseDown={handleMouseDown}
              style={{
                left: `${cropBox.x}%`,
                top: `${cropBox.y}%`,
                width: `${cropBox.width}%`,
                height: `${cropBox.height}%`,
              }}
              className="absolute border-2 border-orange-500 bg-orange-500/10 cursor-move shadow-2xl backdrop-contrast-125"
            >
              {/* Rule of Thirds Grid Lines */}
              <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none">
                <div className="border-r border-b border-orange-500/30" />
                <div className="border-r border-b border-orange-500/30" />
                <div className="border-b border-orange-500/30" />
                <div className="border-r border-b border-orange-500/30" />
                <div className="border-r border-b border-orange-500/30" />
                <div className="border-b border-orange-500/30" />
                <div className="border-r border-orange-500/30" />
                <div className="border-r border-orange-500/30" />
                <div />
              </div>

              {/* Corner Handles */}
              <div className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-white border-2 border-orange-600 rounded-xs" />
              <div className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-white border-2 border-orange-600 rounded-xs" />
              <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-white border-2 border-orange-600 rounded-xs" />
              <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-white border-2 border-orange-600 rounded-xs" />

              {/* Preset badge indicator */}
              <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-orange-600 text-white text-[10px] font-bold font-mono">
                {selectedPreset} ({estimatedWidth}x{estimatedHeight})
              </div>
            </div>

            {/* Focal Point Indicator (Crosshair) */}
            <div
              style={{ left: `${focalPoint.x}%`, top: `${focalPoint.y}%` }}
              className="absolute w-8 h-8 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-amber-400 bg-amber-400/20 pointer-events-none flex items-center justify-center shadow-lg transition-all"
            >
              <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
              <div className="absolute -bottom-5 whitespace-nowrap bg-slate-900/90 text-amber-300 text-[9px] font-mono px-1.5 py-0.5 rounded shadow-sm">
                Focal: {focalPoint.x}%, {focalPoint.y}%
              </div>
            </div>
          </div>

          {/* Focal Point Bar & Save Button */}
          <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 rounded-xl text-xs">
            <div className="flex items-center gap-2">
              <Crosshair className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
              <div>
                <span className="font-bold text-amber-900 dark:text-amber-200">
                  Điểm hội tụ (Focal Point): X={focalPoint.x}%, Y={focalPoint.y}%
                </span>
                <p className="text-[11px] text-amber-700/80 dark:text-amber-400/80">
                  Vị trí này được lưu vào DB để hệ thống tự căn chỉnh thẻ ảnh không bao giờ mất góc chính.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleSaveFocalPoint}
              disabled={!canEdit || isSavingFocal || isPending}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-lg text-xs transition-colors disabled:opacity-50"
            >
              {isSavingFocal ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
              Lưu tiêu điểm
            </button>
          </div>
        </div>

        {/* Right: Live Result Preview & Crop Action Card */}
        <div className="lg:col-span-4 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-orange-500" /> Xem trước kết quả (Live Preview)
            </span>

            {/* Preview Box */}
            <div className="bg-slate-950 p-2 rounded-2xl border border-slate-800 shadow-md">
              <div
                style={{
                  aspectRatio:
                    selectedPreset === '16:9'
                      ? '16/9'
                      : selectedPreset === '4:3'
                      ? '4/3'
                      : selectedPreset === '1:1'
                      ? '1/1'
                      : selectedPreset === '3:2'
                      ? '3/2'
                      : `${cropBox.width}/${cropBox.height}`,
                }}
                className="w-full bg-slate-900 rounded-xl overflow-hidden relative border border-slate-800 flex items-center justify-center"
              >
                <div
                  className="w-full h-full relative overflow-hidden"
                  style={{
                    backgroundImage: `url(${asset.url})`,
                    backgroundPosition: `${cropBox.x}% ${cropBox.y}%`,
                    backgroundSize: `${(100 / (cropBox.width || 1)) * 100 * zoom}%`,
                    backgroundRepeat: 'no-repeat',
                  }}
                />
              </div>

              {/* Specs Badge */}
              <div className="mt-2 grid grid-cols-2 gap-1 text-[11px] text-slate-400 font-mono px-1">
                <div>Kích thước: <strong className="text-slate-200">{estimatedWidth}x{estimatedHeight}</strong></div>
                <div>Định dạng: <strong className="text-emerald-400">WebP (Sharp)</strong></div>
              </div>
            </div>

            <div className="text-[11px] text-slate-500 bg-slate-50 dark:bg-slate-850 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
              <p className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300 mb-1">
                <Info className="w-3.5 h-3.5 text-blue-500" /> Cơ chế sản xuất an toàn:
              </p>
              Ảnh gốc vẫn được bảo toàn nguyên vẹn 100%. Biến thể mới được xuất chuẩn WebP nén không suy hao và lưu độc lập vào Storage.
            </div>
          </div>

          {/* Primary Action Button: Create Crop Variant */}
          <button
            type="button"
            onClick={handleCreateCropVariant}
            disabled={!canEdit || isPending}
            className="w-full py-3 px-4 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg hover:shadow-orange-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Đang cắt & xử lý WebP với Sharp...
              </>
            ) : (
              <>
                <Scissors className="w-4 h-4" />
                Cắt ảnh & Tạo biến thể WebP ({selectedPreset})
              </>
            )}
          </button>
        </div>
      </div>

      {/* 3. LIST OF CREATED VARIANTS */}
      <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-orange-500" />
            Danh sách Biến thể Đã Lưu ({asset.variants?.length || 0} bản)
          </h4>
          <span className="text-[11px] text-slate-400">Quan hệ Original → Variants được duy trì tự động</span>
        </div>

        {asset.variants && asset.variants.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {asset.variants.map((v) => (
              <div
                key={v.id}
                className="flex items-center gap-3 p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
              >
                {/* Variant Thumbnail */}
                <div className="w-16 h-12 bg-slate-950 rounded-lg overflow-hidden shrink-0 border border-slate-800 flex items-center justify-center">
                  <img src={v.url} alt={v.preset_name} className="w-full h-full object-cover" />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0 space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-800 dark:text-slate-200 uppercase text-[11px] px-1.5 py-0.2 rounded bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-300">
                      {v.preset_name}
                    </span>
                    <span className="px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-mono uppercase text-slate-500">
                      {v.format}
                    </span>
                  </div>
                  <div className="text-[11px] font-mono text-slate-500">
                    {v.width} x {v.height} px • {v.file_size_kb} KB
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 shrink-0">
                  <a
                    href={v.url}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors"
                    title="Mở xem kích thước gốc"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(v.url)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors"
                    title="Sao chép liên kết"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  {canEdit && (
                    <button
                      type="button"
                      onClick={() => handleDeleteVariant(v.id, v.preset_name)}
                      disabled={isPending}
                      className="p-1.5 rounded-lg text-rose-400 hover:text-rose-600 transition-colors"
                      title="Xóa biến thể này"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 text-xs text-slate-500 space-y-2">
            <Scissors className="w-8 h-8 text-slate-400 mx-auto opacity-50" />
            <p className="font-medium">Chưa có biến thể crop nào cho tệp này.</p>
            <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
              Hãy chọn tỉ lệ (16:9, 4:3, 1:1, 3:2) ở trên và bấm &quot;Cắt ảnh & Tạo biến thể WebP&quot; để tạo phiên bản tối ưu.
            </p>
          </div>
        )}
      </div>

      <CmsDeleteConfirmModal
        isOpen={!!deleteVariantTarget}
        title="Xác nhận xóa biến thể ảnh?"
        itemName={deleteVariantTarget?.presetName}
        description={`Biến thể "${deleteVariantTarget?.presetName}" và tệp ảnh đã crop trong bộ lưu trữ sẽ bị xóa vĩnh viễn.`}
        confirmLabel="Xóa biến thể"
        zIndex="z-[70]"
        isPending={isPending}
        onClose={() => setDeleteVariantTarget(null)}
        onConfirm={confirmDeleteVariant}
      />
    </div>
  );
};
