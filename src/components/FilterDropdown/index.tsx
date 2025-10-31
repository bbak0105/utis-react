import { useState } from 'react'
import s from './FilterDropdown.module.scss'

interface FilterOption {
  value: string
  label: string
}

interface FilterDropdownProps {
  options: FilterOption[]
  selectedValue: string
  onSelect: (value: string) => void
  placeholder?: string
}

const FilterDropdown = ({ 
  options, 
  selectedValue, 
  onSelect, 
  placeholder = "정렬 기준" 
}: FilterDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false)

  const selectedOption = options.find(option => option.value === selectedValue)

  const handleSelect = (value: string) => {
    onSelect(value)
    setIsOpen(false)
  }

  return (
    <div className={s.dropdown}>
      <button 
        className={s.dropdownButton}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span className={s.selectedText}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <i className={`ri-arrow-down-s-line ${s.arrow} ${isOpen ? s.arrowOpen : ''}`}></i>
      </button>
      
      {isOpen && (
        <>
          <div className={s.overlay} onClick={() => setIsOpen(false)} />
          <div className={s.dropdownMenu}>
            {options.map((option) => (
              <button
                key={option.value}
                className={`${s.dropdownItem} ${selectedValue === option.value ? s.selected : ''}`}
                onClick={() => handleSelect(option.value)}
              >
                <span className={s.itemLabel}>{option.label}</span>
                {selectedValue === option.value && (
                  <i className="ri-check-line"></i>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default FilterDropdown
