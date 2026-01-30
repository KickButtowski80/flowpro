import { ref } from 'vue'
import { useIntersectionObserver } from '@vueuse/core'

/**
 * Active Section Detection Composable
 * 
 * Uses IntersectionObserver to detect which section is currently visible
 * and provides plumbing-themed active state management
 */
export function useActiveSection() {
  const activeSection = ref('')
  
  /**
   * Observe a section for intersection
   * @param {string} sectionId - The section identifier
   * @param {Ref<HTMLElement>} element - The section element to observe
   */
  const observeSection = (sectionId, element) => {
    if (!element) return
    
    useIntersectionObserver(
      element,
      ([entry]) => {
        const intersecting = Boolean(entry?.isIntersecting)
        if (intersecting) {
          activeSection.value = sectionId
        }
      },
      {
        threshold: 0.5,
        rootMargin: '0px'
      }
    )
  }
  
  /**
   * Check if a section is currently active
   * @param {string} sectionId - The section to check
   * @returns {boolean} - Whether the section is active
   */
  const isSectionActive = (sectionId) => {
    return activeSection.value === sectionId
  }
  
  return {
    activeSection,
    observeSection,
    isSectionActive
  }
}
