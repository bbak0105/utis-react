import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Breadcrumb from '@/components/Breadcrumb'
import FilterDropdown from '@/components/FilterDropdown'
import { RiArrowDownSLine, RiArrowLeftSLine, RiArrowRightSLine, RiArrowLeftDoubleLine, RiArrowRightDoubleLine } from 'react-icons/ri'
import s from './CustomerService.module.scss'
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
  type ColumnDef,
} from '@tanstack/react-table'

interface Notice {
  id: number
  title: string
  author: string
  date: string
  views: number
}

const NOTICE_DATA: Notice[] = [
  { id: 1, title: '몰 오픈을 축하합니다.', author: 'E****', date: '2025-09-26', views: 5 },
  { id: 2, title: '서비스 이용 안내', author: '관리자', date: '2025-09-25', views: 12 },
  { id: 3, title: '배송 정책 변경 안내', author: '관리자', date: '2025-09-24', views: 8 },
  { id: 4, title: '환불 정책 안내', author: '관리자', date: '2025-09-23', views: 15 },
  { id: 5, title: '회원 등급 혜택 안내', author: '관리자', date: '2025-09-22', views: 20 },
]

const TABS = [
  { id: 'notice', label: '공지사항', path: '/cs/notice' },
  { id: 'event', label: '이벤트', path: '/cs/event' },
  { id: 'inquiry', label: '문의하기', path: '/cs/inquiry' },
  { id: 'review', label: '상품리뷰', path: '/cs/review' },
]

const TIME_FILTER_OPTIONS = [
  { value: 'all', label: '전체' },
  { value: 'week', label: '일주일' },
  { value: 'month', label: '한달' },
  { value: '3months', label: '3개월' },
]

const SEARCH_FILTER_OPTIONS = [
  { value: 'title', label: '제목' },
  { value: 'content', label: '내용' },
  { value: 'author', label: '작성자' },
]

const CustomerService = () => {
  const navigate = useNavigate()
  const location = useLocation()
  
  // 경로에 따라 activeTab 설정
  const getActiveTab = () => {
    if (location.pathname.includes('/event')) return 'event'
    if (location.pathname.includes('/inquiry')) return 'inquiry'
    if (location.pathname.includes('/review')) return 'review'
    return 'notice'
  }
  
  const [activeTab, setActiveTab] = useState(getActiveTab())
  const [timeFilter, setTimeFilter] = useState('week')
  const [searchFilter, setSearchFilter] = useState('title')
  const [searchTerm, setSearchTerm] = useState('')

  // 경로 변경 시 activeTab 업데이트
  useEffect(() => {
    setActiveTab(getActiveTab())
  }, [location.pathname])

  const columns: ColumnDef<Notice>[] = [
    {
      accessorKey: 'id',
      header: '번호',
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: 'title',
      header: '제목',
      cell: (info) => (
        <button 
          className={s.titleLink}
          onClick={() => navigate(`/cs/notice/${info.row.original.id}`)}
        >
          {info.getValue() as string}
        </button>
      ),
    },
    {
      accessorKey: 'author',
      header: '작성자',
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: 'date',
      header: '작성일',
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: 'views',
      header: '조회',
      cell: (info) => info.getValue(),
    },
  ]

  const table = useReactTable({
    data: NOTICE_DATA,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  })

  const getPageTitle = () => {
    switch (activeTab) {
      case 'event': return '이벤트'
      case 'inquiry': return '문의하기'
      case 'review': return '상품리뷰'
      default: return '공지사항'
    }
  }

  const breadcrumbItems = [
    { label: '홈', path: '/' },
    { label: '게시판' },
    { label: getPageTitle() },
  ]

  return (
    <div className={s.container}>
      {/* Breadcrumb */}
      <div className={s.breadcrumbContainer}>
        <Breadcrumb items={breadcrumbItems} />
      </div>

      {/* 제목 */}
      <h1 className={s.pageTitle}>{getPageTitle()}</h1>

      {/* 탭 네비게이션 */}
      <div className={s.tabs}>
        {TABS.map((tab) => (
          <button
            key={tab.id}
            className={`${s.tab} ${activeTab === tab.id ? s.active : ''}`}
            onClick={() => {
              setActiveTab(tab.id)
              navigate(tab.path)
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 테이블 */}
      <div className={s.tableContainer}>
        <table className={s.table}>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className={s.tableHeader}>
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className={s.tableRow}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className={s.tableCell}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 검색/필터 */}
      <div className={s.searchSection}>
        <div className={s.searchFilters}>
          <FilterDropdown
            options={TIME_FILTER_OPTIONS}
            selectedValue={timeFilter}
            onSelect={setTimeFilter}
            placeholder="기간 선택"
          />
          <FilterDropdown
            options={SEARCH_FILTER_OPTIONS}
            selectedValue={searchFilter}
            onSelect={setSearchFilter}
            placeholder="검색 기준"
          />
          <input
            type="text"
            className={s.searchInput}
            placeholder="검색어를 입력하세요"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className={s.searchButton}>찾기</button>
        </div>
      </div>

      {/* 페이지네이션 */}
      <div className={s.pagination}>
        <button
          className={s.paginationButton}
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
        >
          <RiArrowLeftDoubleLine />
        </button>
        <button
          className={s.paginationButton}
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <RiArrowLeftSLine />
        </button>
        <span className={s.pageNumber}>
          {table.getState().pagination.pageIndex + 1}
        </span>
        <button
          className={s.paginationButton}
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          <RiArrowRightSLine />
        </button>
        <button
          className={s.paginationButton}
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
        >
          <RiArrowRightDoubleLine />
        </button>
      </div>
    </div>
  )
}

export default CustomerService

