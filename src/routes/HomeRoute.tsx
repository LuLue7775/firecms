import React, { useEffect } from "react";
import { Link as ReactLink, useRouteMatch } from "react-router-dom";
import {
    BreadcrumbEntry,
    computeNavigation,
    TopNavigationEntry
} from "./navigation";
import PlaylistPlayIcon from "@material-ui/icons/PlaylistPlay";
import { useBreadcrumbsContext } from "../contexts";
import { AdditionalView } from "../CMSAppProps";
import { EntityCollection } from "../models";
import ReactMarkdown from "react-markdown";
import {
    Box,
    Card,
    CardActionArea,
    CardActions,
    CardContent,
    Container,
    createStyles,
    Divider,
    Grid,
    IconButton,
    makeStyles,
    Theme,
    Typography
} from "@material-ui/core";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";

export const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        card: {
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            minHeight: 248
        },
        flexGrow: {
            flexGrow: 1
        }
    })
);


interface HomeRouteProps {
    navigation: EntityCollection[],
    additionalViews: AdditionalView[] | undefined;
}

function HomeRoute({
                       navigation,
                       additionalViews
                   }: HomeRouteProps) {

    const classes = useStyles();
    const { url } = useRouteMatch();

    const breadcrumb: BreadcrumbEntry = {
        title: "Home",
        url: url
    };

    const breadcrumbsContext = useBreadcrumbsContext();

    useEffect(() => {
        breadcrumbsContext.set({
            breadcrumbs: [breadcrumb]
        });
    }, [url]);

    const {
        navigationEntries,
        groups
    } = computeNavigation(navigation, additionalViews);

    const allGroups: Array<string | null> = [...groups];
    if (navigationEntries.filter(e => !e.group).length > 0) {
        allGroups.push(null);
    }

    function buildNavigationCard(entry: TopNavigationEntry) {
        return <Grid item xs={12} sm={6} md={4}>
            <Card elevation={0}
                  className={classes.card}>

                <CardContent
                    className={classes.flexGrow}>

                    <PlaylistPlayIcon color={"disabled"}/>
                    <Typography gutterBottom variant="h5"
                                component="h2">
                        {entry.name}
                    </Typography>

                    {entry.description && <Typography variant="body2"
                                                      color="textSecondary"
                                                      component="div">
                        <ReactMarkdown>{entry.description}</ReactMarkdown>
                    </Typography>}
                </CardContent>

                <CardActionArea
                    style={{
                        display: "flex",
                        backgroundColor: "#fbfbfb",
                        flexDirection: "column",
                        alignItems: "flex-end"
                    }}
                    component={ReactLink}
                    to={entry.url}>
                    <CardActions style={{ alignSelf: "flex-end" }}>
                        <IconButton color="primary">
                            <ArrowForwardIcon/>
                        </IconButton>
                    </CardActions>

                </CardActionArea>
            </Card>
        </Grid>;
    }

    const groupViews
        = allGroups.map((group) => (
        <Box mt={6}>
            <Typography color={"textSecondary"} className={"weight-500"}>
                {group?.toUpperCase() ?? "Ungrouped".toUpperCase()}
            </Typography>
            <Divider/>
            <Box mt={2}>
                <Grid container spacing={2}>
                    {group && navigationEntries
                        .filter((entry) => entry.group === group)
                        .map((entry) => buildNavigationCard(entry))
                    }
                    {!group && navigationEntries
                        .filter((entry) => !entry.group)
                        .map((entry) => buildNavigationCard(entry))
                    }
                </Grid>
            </Box>
        </Box>
    ));

    return <Container>
        {groupViews}
    </Container>;
}

export default HomeRoute;
