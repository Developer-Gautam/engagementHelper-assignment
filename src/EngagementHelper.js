// EngagementHelper.js

const EngagementHelper = {
  engagementMessageOverTimeChartOptions: (messageCountList, channels) => {
    // Step 1: Extract relevant data
    const messageCountsByChannelAndDate = {};

    messageCountList.forEach((message) => {
      const channelId = message.channelId;
      const timeBucket = new Date(message.timeBucket).getTime();
      const count = parseInt(message.count);

      if (!messageCountsByChannelAndDate[channelId]) {
        messageCountsByChannelAndDate[channelId] = {};
      }

      messageCountsByChannelAndDate[channelId][timeBucket] = count;
    });

    // Step 2: Group message counts by channel ID and filter out channels with one date
    const channelsWithData = channels.filter((channel) => {
      const channelId = channel.id;
      return (
        messageCountsByChannelAndDate[channelId] &&
        Object.keys(messageCountsByChannelAndDate[channelId]).length > 1
      );
    });

    // Step 3: Prepare data for Highcharts series
    const seriesData = channelsWithData.map((channel) => {
      const channelId = channel.id;
      const name = channel.name;
      const data = Object.keys(messageCountsByChannelAndDate[channelId]).map(
        (timestamp) => [
          parseInt(timestamp),
          messageCountsByChannelAndDate[channelId][timestamp],
        ]
      );

      return {
        name,
        data,
      };
    });

    // Step 4: Create Highcharts options object
    const options = {
      chart: {
        type: "line",
      },
      title: {
        text: "Engagement: Messages Over Time",
      },
      xAxis: {
        type: "datetime",
        title: {
          text: "Date",
        },
      },
      yAxis: {
        title: {
          text: "Message Count",
        },
      },
      tooltip: {
        shared: true,
        crosshairs: true,
        formatter: function () {
          const date = new Date(this.x).toDateString();
          let tooltip = `<b>${date}</b><br/>`;
          this.points.forEach((point) => {
            tooltip += `${point.series.name}: ${point.y}<br/>`;
          });
          return tooltip;
        },
      },
      series: seriesData,
    };

    return options;
  },
};

export default EngagementHelper;
