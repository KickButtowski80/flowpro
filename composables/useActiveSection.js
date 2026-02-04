import { ref } from 'vue'
import { useIntersectionObserver } from '@vueuse/core'

/**
 * Active Section Detection Composable
 * 
 * Uses IntersectionObserver to detect which section is currently visible.
 * No cleanup needed - navbar never unmounts.
 */
export function useActiveSection() {
  const activeSection = ref('')
  
  /**
   * Observe a section for intersection
   * @param {string} sectionId - The section identifier
   * @param {HTMLElement} element - DOM element to observe
   */
  const observeSection = (sectionId, element) => {
    if (!element) return
    
    useIntersectionObserver(
      element,
      ([entry]) => {
        if (entry?.isIntersecting) {
          activeSection.value = sectionId
        }
      },
      {
        threshold: [0.1, 0.3, 0.5, 0.7],
        rootMargin: '0px'
      }
    )
  }
  
  const isSectionActive = (sectionId) => activeSection.value === sectionId
  
  return { activeSection, observeSection, isSectionActive }
}
