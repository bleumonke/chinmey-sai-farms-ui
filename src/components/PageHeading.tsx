import React from "react";
import { Typography } from "@mui/material";


interface PageHeadingProps {
    title:string;
    sub_title:string;
}

const PageHeading: React.FC<PageHeadingProps> = ({
    title,
    sub_title
}) => {
    return (
        <>
            <Typography variant="h6" fontWeight={600} gutterBottom>{title}</Typography>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom fontWeight={400}>{sub_title}</Typography>
        </>
    )
}

export default PageHeading;