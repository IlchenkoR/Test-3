"use strict";
/**
 * Модуль содержит ключи интеграции и другие конфигурации
 */
Object.defineProperty(exports, "__esModule", { value: true });
const config = {
    // данные для api amocrm
    CLIENT_ID: "9f17d5e4-72ab-485b-83f1-3ad857fc5fe7",
    CLIENT_SECRET: "vWTuLKkstfLRPOrB9ihwCSmYDOBuYranZM6gawEZxkooFSYSQJVEazj4Z1Uh5Smi",
    //AUTH_CODE живет 20 минут, при перезапуске скрипта нужно брать новый
    AUTH_CODE: "def50200df675e2cfe76a090b8efaab726228ff927f69ade96712cf716e5643d8cd2508211bfb2a69e12be116f96f8a2b24b837b977ff4b8b79228cf4e319ab5d5ca6d3ca954f10b7441e18ad466d39d7c1b9af3a07001b99bf6fb795fab3b103eef4eb5761e359760f6a30b5aff64b37edc5212732ab2c20eb52b90c44ec7ffb82424855dc2ff45974f2e24f364d07aa822b90416ac956b49354215f6e706394e526c0ef801c9dba52efce0507d46dab40d2dc6a8492076221f64d9488aa4060db77f862e640b34f773d777b42f670e37708c814e067c85ef4dae6c75ab0650003c96a4b0e3e62dd54a69e0ed93b2c0d0377d9e3b0baa87f45991ca2650c194821c8a6e87ae46cf7894c1c9ac7f449ceec6694d3b5154a562751d8395ce1f379abe41b689e042c1d432733de7600067cb86f910f653a1b0ca68220fe99a30368a03d99dfe617698a29d915c0c4cc203aa6f7b71f846c1d0a349a4607acca79cc1d8c1b6217646cd2cd4bc78661f4eb80500b9ae2622daef7a89ebee5090508ed66758bfe6effcb46c9cd7b564664006bafcd5ca84135dbc93a3c00c00ef950397bbbd6b203acb21e279f027c8dbb40c5409b384dc0b042ac3a54157c341296b4dcc1021a35046f3dfc11aeb57fc3d6639876109b29c3823776434136bdf7d623546c5d6ac790eace94b4a4d7ccb8b5d2a65a7317f6b70ea394d134ed4ada794cb",
    REDIRECT_URI: "https://5d26-77-95-90-50.ngrok-free.app/install",
    SUB_DOMAIN: "rilchenko",
    // конфигурация сервера
    PORT: 2000,
};
exports.default = config;
