import styled from "styled-components";

export const HeaderContainer = styled.header`
  padding: 10px 20px 10px 20px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: var(--bg-s);
  position: sticky;
  top: 0;
  svg {
    font-size: 30px;
    color: var(--tx-p);
  }
  .contact {
    position: relative;
    svg {
      color: var(--tx-t);
    }
    .box-contact {
        position: absolute;
        top: 45px;
        right: 0;
        background-color: var(--bg-s);
        padding:5px 10px;
        border-radius: 5px;
        font-size: 0.85rem;
        border: 1px solid var(--tx-s);
        z-index: 2;
        width: 144px;
        animation: fadeUp 500ms;
        >li{
            cursor: pointer;
            display: block;
            :hover{
                color: var(--tx-t);
                svg{
                    color: var(--tx-t);
                }
            }
            svg{
                font-size: 0.7rem;
                margin:  0 8px 0 0;
            }
        }
        ::after{
            z-index: 0;
            border-top: 1px solid var(--tx-s);
            border-left: 1px solid var(--tx-s);
            position: absolute;
            top: -6px;
            content: '';
            width: 10px;
            height: 10px;
            background-color: var(--bg-s);
            right: 10px;
            transform: rotate(45deg);
        }
    }
  }
  > div {
    display: flex;
    align-items: center;
    gap: 10px;
    > span {
      font-size: 0.7rem;
    }
  }
`;
