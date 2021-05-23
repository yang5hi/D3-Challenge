# D3 Homework - Data Journalism and D3

This project is to analyze the current trends shaping people's lives. I used JavaScript to create charts, graphs, and interactive elements to help readers understand the findings. To understand the health risks facing particular demographics. I sifted through information from the U.S. Census Bureau and the Behavioral Risk Factor Surveillance System. The data set I used here is based on 2014 ACS 1-year estimates from the [US Census Bureau](https://data.census.gov/cedsci/). The current data set includes data on rates of income, obesity, poverty, etc., by state. MOE stands for "margin of error."

### D3 Scatter plot with multiple axises and tooltip

![IndexPage](Images/index.png)

I created a scatter plot between two of the data variables, such as `Healthcare vs. Poverty` or `Smokers vs. Age`. From the above screenshot, in the scatter plot, each circle element represents each state with its abbreviations. Additional labels were combined in the scatter plot and give them click events so that users can decide which data to display. The transitions for the circles' locations as well as the range of the axes were animated. I also added tooltips to the circles and display each tooltip with the data that the user has selected. 

### Correlations Discovered Between Health Risks and Age, Income
Among all nine correlations, the observations are: 1) Obesity and Household Income are inversely proportional. Meantime, obesity percentage increases with poverty percentage. 2) Smoke percentage and the percentage of population lack healthcare follow the same trend as obesity. 3) Age is not a significant factor in all of the comparisons. 
- - -

© 2021 Trilogy Education Services, LLC, a 2U, Inc. brand. Confidential and Proprietary. All Rights Reserved.
