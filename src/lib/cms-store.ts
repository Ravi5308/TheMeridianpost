import { useSyncExternalStore } from 'react'

import {
  articles as seedArticles,
  media as seedMedia,
  type Article,
  type MediaAsset,
} from '@/data/fixtures'

// Browser-session store for the newsroom screens. Changes live until reload;
// milestone 2 replaces these actions with server functions backed by
// Netlify Database (articles) and Netlify Blobs (media). See PLAN.md.

type State = { articles: Article[]; media: MediaAsset[] }

let state: State = { articles: seedArticles, media: seedMedia }
const listeners = new Set<() => void>()

function set(next: Partial<State>) {
  state = { ...state, ...next }
  listeners.forEach((l) => l())
}

function subscribe(l: () => void) {
  listeners.add(l)
  return () => listeners.delete(l)
}

// Returns the whole snapshot; derive filtered lists in the component so the
// snapshot reference stays stable between renders.
export function useCms(): State {
  return useSyncExternalStore(
    subscribe,
    () => state,
    () => state,
  )
}

export const cms = {
  saveArticle(article: Article) {
    const exists = state.articles.some((a) => a.id === article.id)
    set({
      articles: exists
        ? state.articles.map((a) => (a.id === article.id ? article : a))
        : [article, ...state.articles],
    })
  },
  deleteArticle(id: string) {
    set({ articles: state.articles.filter((a) => a.id !== id) })
  },
  addMedia(asset: MediaAsset) {
    set({ media: [asset, ...state.media] })
  },
  updateMedia(asset: MediaAsset) {
    set({ media: state.media.map((m) => (m.id === asset.id ? asset : m)) })
  },
  deleteMedia(id: string) {
    set({ media: state.media.filter((m) => m.id !== id) })
  },
}
