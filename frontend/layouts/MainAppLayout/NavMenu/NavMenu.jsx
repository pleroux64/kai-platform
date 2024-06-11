import { useEffect, useState } from 'react'

import { Grid, MenuItem } from '@mui/material'
import { useRouter } from 'next/router'

import Briefcase from '@/assets/svg/Briefcase.svg'
import ChatBubble from '@/assets/svg/ChatBubble.svg'
import MenuBook from '@/assets/svg/Menu book.svg'

import ROUTES from '@/constants/routes'

import styles from './styles'

import { chatRegex, homeRegex } from '@/regex/routes'

const PAGES = [
  {
    name: 'Kai Tools',
    link: ROUTES.HOME,
    icon: <Briefcase />,
    id: 'page_1',
  },
  {
    name: 'Kai Chat',
    link: ROUTES.CHAT,
    icon: <ChatBubble />,
    id: 'page_2',
  },
  {
    name: 'Output History',
    link: ROUTES.HISTORY,
    icon: <MenuBook />,
    id: 'page_3',
  },
]

/**
 * Returns a navigation menu component that displays a list of links.
 *
 * @return {JSX.Element} A React component that renders a navigation menu.
 */
const NavMenu = () => {
  const router = useRouter()
  const { pathname } = router
  const [activeId, setActiveId] = useState('')

  useEffect(() => {
    const setActive = () => {
      const activePage = PAGES.find((page) => page.link === pathname)
      setActiveId(activePage ? activePage.id : 'page_1')
    }

    setActive()
  }, [pathname])

  const handleRoute = (link, id) => {
    router.push(link)
    setActiveId(id)
  }

  return (
    <Grid {...styles.mainGridProps}>
      {PAGES.map((page) => (
        <MenuItem
          key={page.id}
          onClick={() => handleRoute(page.link, page.id)}
          {...styles.menuItemProps(activeId === page.id)}
        >
          <Grid {...styles.innerMenuGridProps}>
            <Grid {...styles.menuIconGridProps}>{page.icon}</Grid>
            <Grid {...styles.menuTitleGridProps}>{page.name}</Grid>
          </Grid>
        </MenuItem>
      ))}
    </Grid>
  )
}

export default NavMenu
