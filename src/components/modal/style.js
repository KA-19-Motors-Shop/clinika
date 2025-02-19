import styled from "styled-components";

export const ModalContainer = styled.div`
    width: 100vw;
    z-index: 20;
    padding: 30px 20px;
    min-height:100vh;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    background-color: rgba(0,0,0,0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: auto;
    .modal-box{
        background-color: var(--bg-s);
        color: var(--tx-p);
        max-width: 520px;
        width: 100%;
        border-radius: 10px;
        overflow: auto;
        animation: scaleUp 1s;
        max-height: 100%;
        position: relative;
    }
    .modal-box::-webkit-scrollbar{
        background-color: transparent;

    }
    .modal-box::-webkit-scrollbar-thumb{
        background-color: transparent;
        
    }
    .modal-box::-webkit-scrollbar-track{
        background-color: var(--bg-s);
        
    }
    .modal-box::-webkit-scrollbar-button{
        height: 30px;
        background-color: transparent;
    }
    .modal-header{
        display: flex;
        align-items: center;
        justify-content: space-between;
        background-color: var(--bg-s);
        padding: 16px;
        border-bottom: 1px solid var(--bg-p);
        position: sticky;
        top: 0;
        left: 0;
        z-index: 22;
        span,svg{
            color: var(--tx-p);
        }
    }
    .modal-body{
        padding: 20px 16px 16px;
        overflow: auto;
    }

    @keyframes scaleUp {
        from{
            transform: scale(0);
            opacity: 0;
        }
        to{
            transform: scale(1);
            opacity: 1;
        }
    }
`
