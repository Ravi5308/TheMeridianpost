import { useRef, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Copy, Search, Trash2, Upload } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import type { MediaAsset } from '@/data/fixtures'
import { cms, useCms } from '@/lib/cms-store'
import { formatDate, imageUrl } from '@/lib/news'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/admin/media')({
  component: MediaLibrary,
})

const ACCEPTED = ['image/jpeg', 'image/png', 'image/webp', 'image/avif']
const MAX_MB = 15

function readDimensions(url: string) {
  return new Promise<{ width: number; height: number }>((resolve) => {
    const img = new Image()
    img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight })
    img.onerror = () => resolve({ width: 0, height: 0 })
    img.src = url
  })
}

function MediaLibrary() {
  const { media } = useCms()
  const [q, setQ] = useState('')
  const [dragging, setDragging] = useState(false)
  const [selected, setSelected] = useState<MediaAsset | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const visible = media.filter((m) =>
    m.alt.toLowerCase().includes(q.toLowerCase()),
  )

  async function handleFiles(files: FileList | null) {
    if (!files) return
    for (const file of Array.from(files)) {
      if (!ACCEPTED.includes(file.type)) {
        toast.error(`${file.name}: use JPG, PNG, WebP or AVIF.`)
        continue
      }
      if (file.size > MAX_MB * 1024 * 1024) {
        toast.error(`${file.name} is larger than ${MAX_MB} MB.`)
        continue
      }
      const url = URL.createObjectURL(file)
      const { width, height } = await readDimensions(url)
      cms.addMedia({
        id: `m${Date.now()}${Math.random().toString(36).slice(2, 6)}`,
        file: url,
        alt: file.name.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' '),
        credit: 'The Meridian',
        width,
        height,
        sizeKb: Math.round(file.size / 1024),
        uploadedAt: new Date().toISOString(),
        usedIn: 0,
      })
      toast.success(`${file.name} added to the library`)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-extrabold">Media library</h1>
          <p className="text-sm text-muted-foreground">
            Every image is resized and served in modern formats by the image
            CDN.
          </p>
        </div>
        <Button onClick={() => inputRef.current?.click()}>
          <Upload /> Upload
        </Button>
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED.join(',')}
          multiple
          className="hidden"
          onChange={(e) => {
            void handleFiles(e.target.files)
            e.target.value = ''
          }}
        />
      </div>

      <div
        onDragOver={(e) => {
          e.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDragging(false)
          void handleFiles(e.dataTransfer.files)
        }}
        className={cn(
          'flex flex-col items-center justify-center gap-2 rounded-sm border-2 border-dashed bg-background px-6 py-10 text-center transition-colors motion-reduce:transition-none',
          dragging && 'border-foreground bg-muted',
        )}
      >
        <Upload className="size-6 text-muted-foreground" />
        <p className="text-sm font-semibold">Drop photos here to upload</p>
        <p className="text-xs text-muted-foreground">
          JPG, PNG, WebP or AVIF, up to {MAX_MB} MB each
        </p>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by description"
          aria-label="Search media"
          className="h-9 w-full rounded-md border border-input bg-background pr-3 pl-9 text-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
        />
      </div>

      {visible.length === 0 ? (
        <p className="py-16 text-center text-sm text-muted-foreground">
          No images match “{q}”.
        </p>
      ) : (
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {visible.map((m) => (
            <li key={m.id}>
              <button
                type="button"
                onClick={() => setSelected(m)}
                className="group block w-full overflow-hidden rounded-sm border bg-background text-left focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
              >
                <img
                  src={imageUrl(m.file, 480, 300)}
                  alt={m.alt}
                  loading="lazy"
                  className="aspect-[8/5] w-full object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none"
                />
                <div className="p-3">
                  <p className="truncate text-sm font-medium">{m.alt}</p>
                  <p className="text-xs text-muted-foreground">
                    {m.width}×{m.height} · {formatSize(m.sizeKb)}
                  </p>
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}

      <Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-md">
          {selected && (
            <AssetDetails
              key={selected.id}
              asset={selected}
              onClose={() => setSelected(null)}
            />
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}

function AssetDetails({
  asset,
  onClose,
}: {
  asset: MediaAsset
  onClose: () => void
}) {
  const [alt, setAlt] = useState(asset.alt)
  const [credit, setCredit] = useState(asset.credit)
  const cdnUrl = asset.file.startsWith('blob:')
    ? 'Available once the upload is stored'
    : `https://custom-news-portal.netlify.app${imageUrl(asset.file, 1200)}`

  return (
    <>
      <SheetHeader>
        <SheetTitle>Image details</SheetTitle>
        <SheetDescription>
          Uploaded {formatDate(asset.uploadedAt, true)} · used in{' '}
          {asset.usedIn} {asset.usedIn === 1 ? 'article' : 'articles'}
        </SheetDescription>
      </SheetHeader>
      <div className="space-y-5 px-4 pb-6">
        <img
          src={imageUrl(asset.file, 800)}
          alt={asset.alt}
          className="w-full rounded-sm"
        />
        <dl className="grid grid-cols-3 gap-2 text-xs">
          {[
            ['Dimensions', `${asset.width}×${asset.height}`],
            ['File size', formatSize(asset.sizeKb)],
            ['Delivered as', 'WebP'],
          ].map(([k, v]) => (
            <div key={k} className="rounded-sm bg-muted p-2">
              <dt className="text-muted-foreground">{k}</dt>
              <dd className="font-semibold">{v}</dd>
            </div>
          ))}
        </dl>
        <div className="space-y-1.5">
          <Label htmlFor="alt">Alt text</Label>
          <Input id="alt" value={alt} onChange={(e) => setAlt(e.target.value)} />
          <p className="text-xs text-muted-foreground">
            Describe the image for screen-reader users.
          </p>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="credit">Credit</Label>
          <Input
            id="credit"
            value={credit}
            onChange={(e) => setCredit(e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="cdn">CDN URL</Label>
          <div className="flex gap-2">
            <Input id="cdn" readOnly value={cdnUrl} className="text-xs" />
            <Button
              variant="outline"
              size="icon"
              aria-label="Copy CDN URL"
              onClick={() => {
                void navigator.clipboard?.writeText(cdnUrl)
                toast.success('URL copied')
              }}
            >
              <Copy />
            </Button>
          </div>
        </div>
        <div className="flex justify-between gap-2 pt-2">
          <Button
            variant="ghost"
            className="text-destructive hover:text-destructive"
            disabled={asset.usedIn > 0}
            title={asset.usedIn > 0 ? 'Image is used in published articles' : undefined}
            onClick={() => {
              cms.deleteMedia(asset.id)
              toast.success('Image deleted')
              onClose()
            }}
          >
            <Trash2 /> Delete
          </Button>
          <Button
            onClick={() => {
              cms.updateMedia({ ...asset, alt, credit })
              toast.success('Image details saved')
              onClose()
            }}
          >
            Save changes
          </Button>
        </div>
      </div>
    </>
  )
}

function formatSize(kb: number) {
  return kb >= 1024 ? `${(kb / 1024).toFixed(1)} MB` : `${kb} KB`
}
