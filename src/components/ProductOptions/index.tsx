import React, { useState, useRef, useEffect } from 'react'
import s from './ProductOptions.module.scss'

export interface ProductOption {
  id: string
  label: string
  type: 'text' | 'select' | 'link' | 'highlight'
  value?: string
  options?: { value: string; label: string }[]
  linkText?: string
  linkIcon?: string
  required?: boolean
  highlightText?: string // 강조할 텍스트
  highlightFirst?: boolean // 강조 텍스트를 앞에 배치할지 여부
}

interface ProductOptionsProps {
  options: ProductOption[]
  selectedValues: Record<string, string>
  onOptionChange: (optionId: string, value: string) => void
}

const CustomSelect: React.FC<{
  option: ProductOption
  selectedValue: string
  onSelect: (value: string) => void
}> = ({ option, selectedValue, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const selectedOptionLabel = option.options?.find(opt => opt.value === selectedValue)?.label || 
    `- [${option.required ? '필수' : '선택'}] ${option.label} 선택 -`

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsOpen(false)
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div className={s.customSelect} ref={dropdownRef}>
      <button 
        className={s.selectButton}
        onClick={() => setIsOpen(!isOpen)}
        type="button"
      >
        <span className={s.selectText}>{selectedOptionLabel}</span>
        <i className={`ri-arrow-down-s-line ${isOpen ? s.expanded : ''}`}></i>
      </button>
      {isOpen && (
        <div className={s.selectDropdown}>
          {option.options?.map((opt) => (
            <button
              key={opt.value}
              className={`${s.selectOption} ${selectedValue === opt.value ? s.selected : ''}`}
              onClick={() => {
                onSelect(opt.value)
                setIsOpen(false)
              }}
              type="button"
            >
              {opt.label}
              {selectedValue === opt.value && <i className="ri-check-line"></i>}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

const ProductOptions: React.FC<ProductOptionsProps> = ({
  options,
  selectedValues,
  onOptionChange,
}) => {
  const renderOptionValue = (option: ProductOption) => {
    switch (option.type) {
      case 'text':
        return <span className={s.optionValue}>{option.value}</span>
      
      case 'link':
        return (
          <span className={s.optionValue}>
            {option.linkText}
            {option.linkIcon && <i className={option.linkIcon}></i>}
          </span>
        )
      
      case 'highlight':
        return (
          <span className={s.optionValue}>
            {option.highlightFirst ? (
              <>
                {option.highlightText && <span className={s.highlight}>{option.highlightText}</span>}
                {option.value}
              </>
            ) : (
              <>
                {option.value}
                {option.highlightText && <span className={s.highlight}>{option.highlightText}</span>}
              </>
            )}
          </span>
        )
      
      case 'select':
        return (
          <CustomSelect
            option={option}
            selectedValue={selectedValues[option.id] || ''}
            onSelect={(value) => onOptionChange(option.id, value)}
          />
        )
      
      default:
        return null
    }
  }

  return (
    <div className={s.options}>
      {options.map((option) => (
        <div key={option.id} className={s.optionRow}>
          <span className={s.optionLabel}>{option.label}</span>
          {renderOptionValue(option)}
        </div>
      ))}
    </div>
  )
}

export default ProductOptions
