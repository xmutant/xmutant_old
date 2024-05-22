
"use client";
import React, { useEffect, useState } from 'react';
import Header from "@/components/headers/Header";
import Footer from "@/components/footer/Footer";

export default function NFTTable() {

    const [users, setUsers] = useState([
      { id: 1, name: "User h", imgUrl: "img/nft-aggregator/item-1.jpg", rewards: 1000, walletAddress: "0x123456789...", timestamp: new Date('2024-05-15') },
      { id: 2, name: "User j", imgUrl: "img/nft-aggregator/item-2.jpg", rewards: 2000, walletAddress: "0x987654321...", timestamp: new Date('2024-05-20') },
      { id: 3, name: "User b", imgUrl: "img/nft-aggregator/item-3.jpg", rewards: 1500, walletAddress: "0xabcdef123...", timestamp: new Date('2024-05-10') },
      { id: 4, name: "User d", imgUrl: "img/nft-aggregator/item-4.jpg", rewards: 1800, walletAddress: "0xfedcba321...", timestamp: new Date('2024-05-05') },
      { id: 5, name: "User p", imgUrl: "img/nft-aggregator/item-5.jpg", rewards: 2200, walletAddress: "0x13579ace...", timestamp: new Date('2024-05-21') },
      // 10 more dummy users
      { id: 6, name: "User q", imgUrl: "img/nft-aggregator/item-6.jpg", rewards: 300, walletAddress: "0x123qwe...", timestamp: new Date('2024-05-22') },
      { id: 7, name: "User r", imgUrl: "img/nft-aggregator/item-7.jpg", rewards: 1200, walletAddress: "0x456rty...", timestamp: new Date('2024-05-18') },
      { id: 8, name: "User s", imgUrl: "img/nft-aggregator/item-8.jpg", rewards: 900, walletAddress: "0x789uio...", timestamp: new Date('2024-05-22') },
      { id: 9, name: "User t", imgUrl: "img/nft-aggregator/item-9.jpg", rewards: 600, walletAddress: "0xabcjkl...", timestamp: new Date('2024-05-12') },
      { id: 10, name: "User u", imgUrl: "img/nft-aggregator/item-10.jpg", rewards: 1100, walletAddress: "0xdefmno...", timestamp: new Date('2024-05-17') },
      { id: 11, name: "User v", imgUrl: "img/nft-aggregator/item-11.jpg", rewards: 1300, walletAddress: "0xghipqr...", timestamp: new Date('2024-05-21') },
      { id: 12, name: "User w", imgUrl: "img/nft-aggregator/item-12.jpg", rewards: 700, walletAddress: "0xjkltuv...", timestamp: new Date('2024-05-20') },
      { id: 13, name: "User x", imgUrl: "img/nft-aggregator/item-13.jpg", rewards: 500, walletAddress: "0xmnopwx...", timestamp: new Date('2024-05-16') },
      { id: 14, name: "User y", imgUrl: "img/nft-aggregator/item-14.jpg", rewards: 1400, walletAddress: "0xqrstyz...", timestamp: new Date('2024-05-22') },
      { id: 15, name: "User z", imgUrl: "img/nft-aggregator/item-14.jpg", rewards: 200, walletAddress: "0xuvwyza...", timestamp: new Date('2024-05-15') }
    ]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [filterType, setFilterType] = useState('all');
  const [resultsCount, setResultsCount] = useState(users.length);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [sortOrder, setSortOrder] = useState('desc');

  // Sort users based on rewards and sortOrder
  useEffect(() => {
    const sortedUsers = [...users].sort((a, b) => {
      if (sortOrder === 'desc') {
        return b.rewards - a.rewards;
      } else {
        return a.rewards - b.rewards;
      }
    });
    setUsers(sortedUsers);
    setFilteredUsers(sortedUsers); // Initialize filtered users with sorted users
  }, [users, sortOrder]);

  // Filter users based on search term and filter type
  useEffect(() => {
    let filtered = users.filter(user => user.name.toLowerCase().includes(searchTerm.toLowerCase()));

    const now = new Date();
    switch (filterType) {
      case '30d':
        filtered = filtered.filter(user => (now - new Date(user.timestamp)) / (1000 * 60 * 60 * 24) <= 30);
        break;
      case '7d':
        filtered = filtered.filter(user => (now - new Date(user.timestamp)) / (1000 * 60 * 60 * 24) <= 7);
        break;
      case '24h':
        filtered = filtered.filter(user => (now - new Date(user.timestamp)) / (1000 * 60 * 60 * 24) <= 1);
        break;
      default:
        break;
    }

    setFilteredUsers(filtered);
    setResultsCount(filtered.length);
  }, [searchTerm, users, filterType]);

  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdated(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (type) => {
    setFilterType(type);
  };

  const handleReload = () => {
    setResultsCount(filteredUsers.length);
    setLastUpdated(new Date());
  };

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
  };

  const formatTimeAgo = (time) => {
    const now = new Date();
    const diff = Math.floor((now - time) / 60000); // Difference in minutes

    if (diff < 1) {
      return 'just now';
    } else if (diff < 60) {
      return `${diff} ${diff === 1 ? 'min' : 'mins'} ago`;
    } else if (diff < 1440) {
      return `${Math.floor(diff / 60)} ${Math.floor(diff / 60) === 1 ? 'hour' : 'hours'} ago`;
    } else {
      return `${Math.floor(diff / 1440)} ${Math.floor(diff / 1440) === 1 ? 'day' : 'days'} ago`;
    }
  };

  return (
    <div>
      <Header />
      <div className="m-8"></div>
      <h1 className="font-display text-center text-5xl font-bold  text-jacarta-800 dark:text-white  lg:text-6xl xl:text-7xl bg-clip-text  pt-24 py-4">
        The<span className="animate-gradient"> Leaderboard</span>
      </h1>
      <div className="leaderboard-tables m-8 rounded-t-xl border border-gray-300 bg-jakarta-600 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white">
        <div className="flex justify-between gap-4 rounded-xl border-b border-jacarta-100 bg-jacarta-50 p-4 dark:border-jacarta-600 dark:bg-jacarta-800 md:flex-row md:items-center md:gap-6">
          <div className="hidden md:flex">
            <div className="flex h-10 w-10 group cursor-pointer items-center justify-center rounded-2lg dark:bg-jacarta-700 dark:border-jacarta-600 border border-jacarta-100 bg-white dark:hover:bg-accent hover:bg-accent hover:border-accent mr-2" onClick={handleReload}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" className="h-4 w-4 fill-jacarta-700 dark:fill-white group-hover:fill-white">
                <path fill="none" d="M0 0h24v24H0z"></path>
                <path d="M5.463 4.433A9.961 9.961 0 0 1 12 2c5.523 0 10 4.477 10 10 0 2.136-.67 4.116-1.81 5.74L17 12h3A8 8 0 0 0 6.46 6.228l-.997-1.795zm13.074 15.134A9.961 9.961 0 0 1 12 22C6.477 22 2 17.523 2 12c0-2.136.67-4.116 1.81-5.74L7 12H4a
8 8 0 0 0 13.54 5.772l.997 1.795z"></path>
</svg>
</div>
<div className="flex flex-shrink-0 flex-col ml-2">
<div className="text-base font-medium text-jacarta-500 dark:text-jacarta-300 md:whitespace-nowrap">
{resultsCount} results
</div>
<div className="text-2xs text-jacarta-300 dark:text-jacarta-400">
{formatTimeAgo(lastUpdated)}
</div>
</div>
</div>
<div className="relative flex w-full flex-1 ml-6">
<form className="relative w-full md:w-2/3">
<input
type="search"
className="h-10 w-full rounded-lg border border-jacarta-100 py-2 px-4 pl-10 text-jacarta-700 placeholder-jacarta-500 focus:ring-accent dark:border-transparent dark:bg-white/[.15] dark:text-white dark:placeholder-white"
placeholder="Search collections"
value={searchTerm}
onChange={handleSearchChange}
/>
<span className="absolute left-0 top-0 flex h-full w-12 items-center justify-center rounded-2xl">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" className="h-4 w-4 fill-jacarta-500 dark:fill-white">
<path fill="none" d="M0 0h24v24H0z"></path>
<path d="M18.031 16.617l4.283 4.282-1.415 1.415L10 18l-6.364-6.364 1.414-1.414z"></path>
</svg>
</span>
</form>
</div>
<div className="flex flex-shrink-0 items-center text-xs font-medium text-jacarta-500 dark:text-jacarta-300 sm:text-sm">
<div
className={`flex h-10 cursor-pointer items-center whitespace-nowrap border border-r-0 border-accent bg-accent p-3 text-white first:rounded-l-lg last:rounded-r-lg hover:border-transparent hover:bg-accent hover:text-white sm:px-4 sm:py-2 ${filterType === 'all' ? 'bg-violet-500' : ''}`}
onClick={() => handleFilterChange('all')}
>
All Time
</div>
<div
className={`flex h-10 cursor-pointer items-center whitespace-nowrap border border-r-0 border-jacarta-100 bg-white p-3 first:rounded-l-lg last:rounded-r-lg hover:border-transparent hover:bg-accent hover:text-white dark:border-jacarta-600 dark:bg-jacarta-700 sm:px-4 sm:py-2 ${filterType === '30d' ? 'bg-violet-500' : ''}`}
onClick={() => handleFilterChange('30d')}
>
30d
</div>
<div
className={`flex h-10 cursor-pointer items-center whitespace-nowrap border border-r-0 border-jacarta-100 bg-white p-3 first:rounded-l-lg last:rounded-r-lg hover:border-transparent hover:bg-accent hover:text-white dark:border-jacarta-600 dark:bg-jacarta-700 sm:px-4 sm:py-2 ${filterType === '7d' ? 'bg-violet-500' : ''}`}
onClick={() => handleFilterChange('7d')}
>
7d
</div>
<div
className={`flex h-10 cursor-pointer items-center whitespace-nowrap border border-jacarta-100 bg-white p-3 first:rounded-l-lg last:rounded-r-lg hover:border-transparent hover:bg-accent hover:text-white dark:border-jacarta-600 dark:bg-jacarta-700 sm:px-4 sm:py-2 ${filterType === '24h' ? 'bg-violet-500' : ''}`}
onClick={() => handleFilterChange('24h')}
>
24h
</div>
</div>
</div>

      <div className="flex items-center bg-gray-100 border py-5 px-4 text-gray-700 dark:bg-gray-800 dark:text-gray-100">
        <div className="w-1/12 text-left">Rank</div>
        <div className="w-5/12 text-left">User</div>
        <div className="flex w-6/12 text-right cursor-pointer items-center justify-end " role="columnheader" onClick={toggleSortOrder}>
          Rewards
          <svg width="16" height="25" fill="none" xmlns="http://www.w3.org/2000/svg" className="ml-1">
            {sortOrder === 'desc' ? (
              <>
                <g clipPath="url(#clip0_2135_22855)">
                  <path d="M8 7.219l-3.3 3.3-.942-.943L8 5.333l4.243 4.243-.943.943-3.3-3.3z" fill="currentColor"></path>
                </g>
                <g clipPath="url(#clip1_2135_22855)">
                  <path d="M8 17.781l3.3-3.3.943.943L8 19.667l-4.242-4.243.942-.943 3.3 3.3z" fill="currentColor"></path>
                </g>
              </>
            ) : (
              <>
                <g clipPath="url(#clip0_2135_22855)">
                  <path d="M8 17.781l3.3-3.3.943.943L8 19.667l-4.242-4.243.942-.943 3.3 3.3z" fill="currentColor"></path>
                </g>
                <g clipPath="url(#clip1_2135_22855)">
                  <path d="M8 7.219l-3.3 3.3-.942-.943L8 5.333l4.243 4.243-.943.943-3.3-3.3z" fill="currentColor"></path>
                </g>
              </>
            )}
            <defs>
              <clipPath id="clip0_2135_22855"><path fill="#fff" d="M0 0h16v16H0z"></path></clipPath>
              <clipPath id="clip1_2135_22855">
                <path fill="#fff" transform="translate(0 9)" d="M0 0h16v16H0z"></path>
              </clipPath>
            </defs>
          </svg>
        </div>
      </div>
     
{filteredUsers.map((user, index) => (
<div key={user.id} className="flex border-t border-gray-300 py-2 px-4 transition-shadow hover:shadow-lg dark:border-gray-600 dark:border-gray-600 dark:bg-gray-900">
<div className="w-1/12 text-left">{index + 1}</div>
<div className="flex w-5/12 items-center">
<figure className="relative mr-5 w-8 shrink-0 self-start lg:w-10">
<img src={user.imgUrl} alt={user.name || user.walletAddress} className="rounded-2xl" loading="lazy" />
<div className="absolute -right-3 top-2 flex h-6 w-6
items-center justify-center rounded-full border-2 border-white bg-green dark:border-gray-600" title="Verified Collection">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" className="h-3.5 w-3.5 fill-white">
  <path fill="none" d="M0 0h24v24H0z"></path>
  <path d="M10 15.172l9.192-9.193 1.415 1.414L10 18l-6.364-6.
364 6.364 1.414-1.414L10 15.172zM12 2a10 10 0 0 1 10 10c0 5.523-4.477 10-10 10s-10-4.477-10-10c0-5.523 4.477-10 10-10zM12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16z"></path>
</svg>
</div>
</figure>
<div className="truncate">
<span className="block font-medium text-jacarta-500 dark:text-jacarta-300">{user.name}</span>
<span className="block text-sm text-jacarta-300 dark:text-jacarta-400">{user.walletAddress}</span>
</div>
</div>
<div className="flex w-6/12 justify-end items-center">
<span className="text-jacarta-500 dark:text-jacarta-300">{user.rewards.toLocaleString()}</span>
</div>
</div>
))}
</div>

      <Footer />
    </div>
  );
}
