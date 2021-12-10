import ClipboardJS from "clipboard";
import { useCallback } from "react";


export function useCopyToClipboard() {
  return useCallback((str) => {
    const btn = document.createElement("button")
    btn.style.display = "none"
    document.body.appendChild(btn)
    const clipboard = new ClipboardJS(btn, {
      text: function() {
        return str
      }
    })
    btn.focus()
    btn.click()
    clipboard.destroy()
    document.body.removeChild(btn)
  }, [])
}